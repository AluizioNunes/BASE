from fastapi import APIRouter, Response, Depends, HTTPException, Request, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.modules.auth.services import (
    authenticate_user, create_access_token, create_refresh_token, get_current_user,
    register_user, generate_password_reset_token, reset_password, setup_mfa,
    verify_mfa_setup, verify_mfa_login, validate_password_strength, verify_token
)
from app.modules.auth.schemas import (
    LoginRequest, RegisterRequest, PasswordResetRequest, PasswordResetConfirm,
    MFARequest, MFASetupRequest, RefreshTokenRequest, UserResponse, LoginResponse,
    RegisterResponse, PasswordValidationResponse, MFASetupResponse, PasswordResetResponse,
    TokenResponse, ErrorResponse
)
from app.modules.auth.oauth import authenticate_oauth_user, get_oauth_url
from app.core.cache import cache_set, cache_get, cache_delete
from sqlalchemy import create_engine, text
from datetime import datetime, timedelta
import os

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

# Configuração do banco de dados
engine = create_engine("postgresql+psycopg://BASE:BASE@10.10.255.111:5432/BASE")

@router.post("/login", response_model=LoginResponse)
@limiter.limit("5/minute")
async def login(data: LoginRequest, response: Response, request: Request):
    """
    Login tradicional com email e senha
    """
    user = authenticate_user(data.email, data.password, request)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    
    # Verifica se MFA está habilitado
    if user.get("mfa_enabled", False):
        # Gera código MFA temporário
        from app.modules.auth.services import generate_mfa_code
        mfa_code = generate_mfa_code()
        cache_key = f"mfa_login:{data.email}"
        cache_set(cache_key, {"code": mfa_code, "user_id": user["id"]}, ex=300)  # 5 minutos
        
        return LoginResponse(
            message="Código MFA enviado",
            requires_mfa=True
        )
    
    # Login sem MFA
    access_token = create_access_token({"sub": user["email"]})
    refresh_token = create_refresh_token({"sub": user["email"]})
    
    # Define cookies
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=bool(os.getenv("PRODUCTION", False)),
        samesite="lax",
        max_age=60*60*24  # 1 dia
    )
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=bool(os.getenv("PRODUCTION", False)),
        samesite="lax",
        max_age=60*60*24*30  # 30 dias
    )
    
    return LoginResponse(
        message="Login realizado com sucesso",
        user=UserResponse(**user)
    )

@router.post("/login/mfa", response_model=LoginResponse)
@limiter.limit("5/minute")
async def login_mfa(data: MFARequest, response: Response, request: Request):
    """
    Verificação MFA durante login
    """
    # Busca dados temporários do login
    email = request.cookies.get("temp_email")
    if not email:
        raise HTTPException(status_code=400, detail="Sessão de login não encontrada")
    
    # Verifica código MFA
    if not verify_mfa_login(email, data.code):
        raise HTTPException(status_code=401, detail="Código MFA inválido")
    
    # Busca usuário
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT * FROM \"Usuarios\" WHERE \"Email\" = :email"),
            {"email": email}
        )
        user = result.fetchone()
        
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
        user_data = {
            "id": user.IdUsuarios,
            "email": user.Email,
            "name": user.Nome,
            "perfil": user.Perfil,
            "funcao": user.Funcao,
            "usuario": user.Usuario,
            "mfa_enabled": getattr(user, 'MFAEnabled', False)
        }
    
    # Cria tokens
    access_token = create_access_token({"sub": user_data["email"]})
    refresh_token = create_refresh_token({"sub": user_data["email"]})
    
    # Define cookies
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=bool(os.getenv("PRODUCTION", False)),
        samesite="lax",
        max_age=60*60*24
    )
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=bool(os.getenv("PRODUCTION", False)),
        samesite="lax",
        max_age=60*60*24*30
    )
    
    # Remove cookie temporário
    response.delete_cookie("temp_email")
    
    return LoginResponse(
        message="Login MFA realizado com sucesso",
        user=UserResponse(**user_data)
    )

@router.post("/register", response_model=RegisterResponse)
@limiter.limit("3/minute")
async def register(data: RegisterRequest, request: Request):
    """
    Registro de novo usuário
    """
    try:
        result = register_user(data.dict())
        return RegisterResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.post("/logout")
async def logout(response: Response):
    """
    Logout do usuário
    """
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    response.delete_cookie("temp_email")
    return {"message": "Logout realizado com sucesso"}

@router.get("/profile", response_model=UserResponse)
async def profile(user=Depends(get_current_user)):
    """
    Obtém perfil do usuário atual
    """
    return UserResponse(**user)

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(data: RefreshTokenRequest, response: Response):
    """
    Renova access token usando refresh token
    """
    try:
        # Verifica refresh token
        payload = verify_token(data.refresh_token, "refresh")
        email = payload.get("sub")
        
        if not email:
            raise HTTPException(status_code=401, detail="Token inválido")
        
        # Verifica se usuário ainda existe
        with engine.connect() as conn:
            result = conn.execute(
                text("SELECT COUNT(*) FROM \"Usuarios\" WHERE \"Email\" = :email"),
                {"email": email}
            )
            if result.fetchone()[0] == 0:
                raise HTTPException(status_code=401, detail="Usuário não encontrado")
        
        # Cria novos tokens
        access_token = create_access_token({"sub": email})
        refresh_token = create_refresh_token({"sub": email})
        
        # Atualiza cookies
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=bool(os.getenv("PRODUCTION", False)),
            samesite="lax",
            max_age=60*60*24
        )
        
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=bool(os.getenv("PRODUCTION", False)),
            samesite="lax",
            max_age=60*60*24*30
        )
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=60*60*24  # 24 horas
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail="Token inválido")

@router.post("/password/reset", response_model=PasswordResetResponse)
@limiter.limit("3/hour")
async def request_password_reset(data: PasswordResetRequest):
    """
    Solicita reset de senha
    """
    try:
        token = generate_password_reset_token(data.email)
        # Em produção, enviaria o token por email
        return PasswordResetResponse(
            message="Token de reset enviado por email",
            token=token  # Apenas para desenvolvimento
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.post("/password/reset/confirm")
async def confirm_password_reset(data: PasswordResetConfirm):
    """
    Confirma reset de senha
    """
    try:
        success = reset_password(data.token, data.new_password)
        if success:
            return {"message": "Senha alterada com sucesso"}
        else:
            raise HTTPException(status_code=400, detail="Erro ao alterar senha")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.post("/password/validate", response_model=PasswordValidationResponse)
async def validate_password(password: str):
    """
    Valida força da senha
    """
    validation = validate_password_strength(password)
    return PasswordValidationResponse(**validation)

@router.post("/mfa/setup", response_model=MFASetupResponse)
async def setup_mfa_endpoint(user=Depends(get_current_user)):
    """
    Configura MFA para o usuário
    """
    try:
        result = setup_mfa(user["id"])
        return MFASetupResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.post("/mfa/verify")
async def verify_mfa_setup_endpoint(data: MFASetupRequest, user=Depends(get_current_user)):
    """
    Verifica código MFA durante setup
    """
    try:
        success = verify_mfa_setup(user["id"], data.code)
        if success:
            return {"message": "MFA configurado com sucesso"}
        else:
            raise HTTPException(status_code=400, detail="Código MFA inválido")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.get("/audit/login")
async def get_login_audit(user=Depends(get_current_user), limit: int = 50):
    """
    Obtém auditoria de login do usuário
    """
    try:
        with engine.connect() as conn:
            # Busca tentativas de login
            result = conn.execute(
                text("""
                    SELECT * FROM LOGIN_AUDIT 
                    WHERE "Email" = :email 
                    ORDER BY "Timestamp" DESC 
                    LIMIT :limit
                """),
                {"email": user["email"], "limit": limit}
            )
            
            attempts = []
            for row in result.fetchall():
                attempts.append({
                    "id": row.Id,
                    "email": row.Email,
                    "success": row.Success,
                    "ip_address": row.IPAddress,
                    "user_agent": row.UserAgent,
                    "timestamp": row.Timestamp.isoformat()
                })
            
            # Calcula estatísticas
            total = len(attempts)
            successful = sum(1 for a in attempts if a["success"])
            failed = total - successful
            
            return {
                "total_attempts": total,
                "successful_attempts": successful,
                "failed_attempts": failed,
                "recent_attempts": attempts
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro ao buscar auditoria")

# Rotas OAuth (mantidas como estavam)
@router.get("/google/login")
async def google_login(request: Request):
    """Inicia o fluxo de login do Google"""
    return get_oauth_url("google", request)

@router.get("/google/callback")
async def google_callback(request: Request, response: Response):
    """Callback do Google OAuth"""
    result = await authenticate_oauth_user("google", "", request)
    
    # Define cookie com o token
    response.set_cookie(
        key="access_token",
        value=result["access_token"],
        httponly=True,
        secure=bool(os.getenv("PRODUCTION", False)),
        samesite="lax",
        max_age=60*60*24  # 1 dia
    )
    
    return result

@router.get("/github/login")
async def github_login(request: Request):
    """Inicia o fluxo de login do GitHub"""
    return get_oauth_url("github", request)

@router.get("/github/callback")
async def github_callback(request: Request, response: Response):
    """Callback do GitHub OAuth"""
    result = await authenticate_oauth_user("github", "", request)
    
    # Define cookie com o token
    response.set_cookie(
        key="access_token",
        value=result["access_token"],
        httponly=True,
        secure=bool(os.getenv("PRODUCTION", False)),
        samesite="lax",
        max_age=60*60*24  # 1 dia
    )
    
    return result
