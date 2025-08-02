from passlib.hash import bcrypt
from jose import jwt, JWTError
from fastapi import HTTPException, status, Request
import os
from datetime import datetime, timedelta
from sqlalchemy import create_engine, text
from app.core.config import settings
from app.core.cache import cache_set, cache_get, cache_delete
import re
import secrets
import hashlib

# Configuração do banco de dados
engine = create_engine(settings.DATABASE_URL)

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS = 30

# Configurações de senha
PASSWORD_MIN_LENGTH = 8
PASSWORD_REQUIRE_UPPERCASE = True
PASSWORD_REQUIRE_LOWERCASE = True
PASSWORD_REQUIRE_DIGITS = True
PASSWORD_REQUIRE_SPECIAL = True

def validate_password_strength(password: str) -> dict:
    """
    Valida a força da senha e retorna detalhes da validação
    """
    errors = []
    warnings = []
    
    if len(password) < PASSWORD_MIN_LENGTH:
        errors.append(f"Senha deve ter pelo menos {PASSWORD_MIN_LENGTH} caracteres")
    
    if PASSWORD_REQUIRE_UPPERCASE and not re.search(r'[A-Z]', password):
        errors.append("Senha deve conter pelo menos uma letra maiúscula")
    
    if PASSWORD_REQUIRE_LOWERCASE and not re.search(r'[a-z]', password):
        errors.append("Senha deve conter pelo menos uma letra minúscula")
    
    if PASSWORD_REQUIRE_DIGITS and not re.search(r'\d', password):
        errors.append("Senha deve conter pelo menos um número")
    
    if PASSWORD_REQUIRE_SPECIAL and not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append("Senha deve conter pelo menos um caractere especial")
    
    # Verificações adicionais para força
    if len(password) < 12:
        warnings.append("Senha com menos de 12 caracteres pode ser fraca")
    
    if re.search(r'(.)\1{2,}', password):
        warnings.append("Evite repetir o mesmo caractere mais de 2 vezes")
    
    if re.search(r'(123|abc|qwe|asd)', password.lower()):
        warnings.append("Evite sequências comuns de caracteres")
    
    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
        "score": calculate_password_score(password)
    }

def calculate_password_score(password: str) -> int:
    """
    Calcula um score de 0-100 para a senha
    """
    score = 0
    
    # Comprimento
    if len(password) >= 8:
        score += 10
    if len(password) >= 12:
        score += 10
    if len(password) >= 16:
        score += 10
    
    # Complexidade
    if re.search(r'[a-z]', password):
        score += 10
    if re.search(r'[A-Z]', password):
        score += 10
    if re.search(r'\d', password):
        score += 10
    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        score += 10
    
    # Variedade de caracteres
    unique_chars = len(set(password))
    if unique_chars >= 8:
        score += 10
    if unique_chars >= 12:
        score += 10
    
    # Penalidades
    if re.search(r'(.)\1{2,}', password):
        score -= 10
    if re.search(r'(123|abc|qwe|asd)', password.lower()):
        score -= 10
    
    return max(0, min(100, score))

def hash_password(password: str) -> str:
    """
    Cria hash da senha usando bcrypt
    """
    return bcrypt.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica se a senha está correta
    """
    return bcrypt.verify(plain_password, hashed_password)

def generate_refresh_token() -> str:
    """
    Gera um refresh token seguro
    """
    return secrets.token_urlsafe(32)

def generate_mfa_code() -> str:
    """
    Gera código MFA de 6 dígitos
    """
    return str(secrets.randbelow(1000000)).zfill(6)

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """
    Cria um access token JWT
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict) -> str:
    """
    Cria um refresh token JWT
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str, token_type: str = "access") -> dict:
    """
    Verifica e decodifica um token JWT
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != token_type:
            raise HTTPException(status_code=401, detail="Tipo de token inválido")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

def log_login_attempt(email: str, success: bool, ip_address: str = None, user_agent: str = None):
    """
    Registra tentativa de login para auditoria
    """
    try:
        with engine.connect() as conn:
            conn.execute(
                text("""
                    INSERT INTO LOGIN_AUDIT (
                        "Email", "Success", "IPAddress", "UserAgent", "Timestamp"
                    ) VALUES (:email, :success, :ip, :ua, :timestamp)
                """),
                {
                    "email": email,
                    "success": success,
                    "ip": ip_address,
                    "ua": user_agent,
                    "timestamp": datetime.utcnow()
                }
            )
            conn.commit()
    except Exception as e:
        # Log do erro mas não falha a autenticação
        print(f"Erro ao registrar auditoria: {e}")

def authenticate_user(email: str, password: str, request: Request = None):
    """
    Autentica usuário usando a tabela USUARIOS com bcrypt
    """
    try:
        with engine.connect() as conn:
            # Busca usuário pelo email
            result = conn.execute(
                text("SELECT * FROM USUARIOS WHERE \"Email\" = :email"),
                {"email": email}
            )
            user = result.fetchone()
            
            if not user:
                log_login_attempt(email, False, 
                                request.client.host if request else None,
                                request.headers.get("user-agent") if request else None)
                return None
            
            # Verifica se a senha está hasheada
            is_hashed = user.Senha.startswith('$2b$') or user.Senha.startswith('$2a$')
            
            if is_hashed:
                # Senha já está hasheada, verifica com bcrypt
                if not verify_password(password, user.Senha):
                    log_login_attempt(email, False, 
                                    request.client.host if request else None,
                                    request.headers.get("user-agent") if request else None)
                    return None
            else:
                # Senha em texto plano (migração)
                if user.Senha != password:
                    log_login_attempt(email, False, 
                                    request.client.host if request else None,
                                    request.headers.get("user-agent") if request else None)
                    return None
                
                # Migra a senha para bcrypt
                hashed_password = hash_password(password)
                conn.execute(
                    text("UPDATE USUARIOS SET \"Senha\" = :senha WHERE \"Email\" = :email"),
                    {"senha": hashed_password, "email": email}
                )
                conn.commit()
            
            # Registra login bem-sucedido
            log_login_attempt(email, True, 
                            request.client.host if request else None,
                            request.headers.get("user-agent") if request else None)
            
            return {
                "id": user.IdUsuarios,
                "email": user.Email,
                "name": user.Nome,
                "perfil": user.Perfil,
                "funcao": user.Funcao,
                "usuario": user.Usuario,
                "mfa_enabled": getattr(user, 'MFAEnabled', False)
            }
            
    except Exception as e:
        print(f"Erro na autenticação: {e}")
        return None

def get_current_user(request: Request):
    """
    Obtém usuário atual baseado no token JWT
    """
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Não autenticado")
    
    try:
        payload = verify_token(token, "access")
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
    except HTTPException:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
    
    # Busca usuário no banco
    try:
        with engine.connect() as conn:
            result = conn.execute(
                text("SELECT * FROM USUARIOS WHERE \"Email\" = :email"),
                {"email": email}
            )
            user = result.fetchone()
            
            if not user:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário não encontrado")
            
            return {
                "id": user.IdUsuarios,
                "email": user.Email,
                "name": user.Nome,
                "perfil": user.Perfil,
                "funcao": user.Funcao,
                "usuario": user.Usuario,
                "mfa_enabled": getattr(user, 'MFAEnabled', False)
            }
    except Exception as e:
        print(f"Erro ao buscar usuário: {e}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Erro ao buscar usuário")

def register_user(user_data: dict) -> dict:
    """
    Registra um novo usuário
    """
    # Valida força da senha
    password_validation = validate_password_strength(user_data["password"])
    if not password_validation["valid"]:
        raise HTTPException(
            status_code=400, 
            detail={"message": "Senha não atende aos requisitos", "errors": password_validation["errors"]}
        )
    
    try:
        with engine.connect() as conn:
            # Verifica se email já existe
            result = conn.execute(
                text("SELECT COUNT(*) FROM USUARIOS WHERE \"Email\" = :email"),
                {"email": user_data["email"]}
            )
            if result.fetchone()[0] > 0:
                raise HTTPException(status_code=400, detail="Email já cadastrado")
            
            # Verifica se CPF já existe
            result = conn.execute(
                text("SELECT COUNT(*) FROM USUARIOS WHERE \"CPF\" = :cpf"),
                {"cpf": user_data["cpf"]}
            )
            if result.fetchone()[0] > 0:
                raise HTTPException(status_code=400, detail="CPF já cadastrado")
            
            # Verifica se usuário já existe
            result = conn.execute(
                text("SELECT COUNT(*) FROM USUARIOS WHERE \"Usuario\" = :usuario"),
                {"usuario": user_data["usuario"]}
            )
            if result.fetchone()[0] > 0:
                raise HTTPException(status_code=400, detail="Nome de usuário já existe")
            
            # Hash da senha
            hashed_password = hash_password(user_data["password"])
            
            # Insere novo usuário
            result = conn.execute(
                text("""
                    INSERT INTO USUARIOS (
                        "Nome", "CPF", "Funcao", "Email", "Usuario", "Senha", 
                        "Perfil", "Cadastrante", "DataCadastro"
                    ) VALUES (
                        :nome, :cpf, :funcao, :email, :usuario, :senha, 
                        :perfil, :cadastrante, :timestamp
                    ) RETURNING "IdUsuarios"
                """),
                {
                    "nome": user_data["nome"],
                    "cpf": user_data["cpf"],
                    "funcao": user_data["funcao"],
                    "email": user_data["email"],
                    "usuario": user_data["usuario"],
                    "senha": hashed_password,
                    "perfil": user_data["perfil"],
                    "cadastrante": user_data["cadastrante"],
                    "timestamp": datetime.utcnow()
                }
            )
            
            user_id = result.fetchone()[0]
            conn.commit()
            
            return {
                "id": user_id,
                "email": user_data["email"],
                "name": user_data["nome"],
                "message": "Usuário registrado com sucesso"
            }
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao registrar usuário: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

def generate_password_reset_token(email: str) -> str:
    """
    Gera token para reset de senha
    """
    try:
        with engine.connect() as conn:
            # Verifica se email existe
            result = conn.execute(
                text("SELECT COUNT(*) FROM USUARIOS WHERE \"Email\" = :email"),
                {"email": email}
            )
            if result.fetchone()[0] == 0:
                raise HTTPException(status_code=404, detail="Email não encontrado")
            
            # Gera token único
            token = secrets.token_urlsafe(32)
            expires = datetime.utcnow() + timedelta(hours=1)
            
            # Armazena no cache
            cache_key = f"password_reset:{token}"
            cache_set(cache_key, {"email": email, "expires": expires.isoformat()}, ex=3600)
            
            return token
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao gerar token de reset: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

def reset_password(token: str, new_password: str) -> bool:
    """
    Reseta a senha usando token
    """
    try:
        # Valida força da senha
        password_validation = validate_password_strength(new_password)
        if not password_validation["valid"]:
            raise HTTPException(
                status_code=400, 
                detail={"message": "Senha não atende aos requisitos", "errors": password_validation["errors"]}
            )
        
        # Busca token no cache
        cache_key = f"password_reset:{token}"
        reset_data = cache_get(cache_key)
        
        if not reset_data:
            raise HTTPException(status_code=400, detail="Token inválido ou expirado")
        
        email = reset_data["email"]
        expires = datetime.fromisoformat(reset_data["expires"])
        
        if datetime.utcnow() > expires:
            cache_delete(cache_key)
            raise HTTPException(status_code=400, detail="Token expirado")
        
        # Hash da nova senha
        hashed_password = hash_password(new_password)
        
        # Atualiza senha no banco
        with engine.connect() as conn:
            conn.execute(
                text("UPDATE USUARIOS SET \"Senha\" = :senha WHERE \"Email\" = :email"),
                {"senha": hashed_password, "email": email}
            )
            conn.commit()
        
        # Remove token do cache
        cache_delete(cache_key)
        
        return True
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao resetar senha: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

def setup_mfa(user_id: int) -> dict:
    """
    Configura MFA para o usuário
    """
    try:
        # Gera código MFA
        mfa_code = generate_mfa_code()
        
        # Armazena no cache temporariamente
        cache_key = f"mfa_setup:{user_id}"
        cache_set(cache_key, {"code": mfa_code, "verified": False}, ex=300)  # 5 minutos
        
        return {
            "mfa_code": mfa_code,
            "message": "Código MFA gerado. Use-o para verificar a configuração."
        }
        
    except Exception as e:
        print(f"Erro ao configurar MFA: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

def verify_mfa_setup(user_id: int, code: str) -> bool:
    """
    Verifica código MFA durante setup
    """
    try:
        cache_key = f"mfa_setup:{user_id}"
        mfa_data = cache_get(cache_key)
        
        if not mfa_data or mfa_data["code"] != code:
            return False
        
        # Marca como verificado
        mfa_data["verified"] = True
        cache_set(cache_key, mfa_data, ex=300)
        
        # Atualiza banco de dados
        with engine.connect() as conn:
            conn.execute(
                text("UPDATE USUARIOS SET \"MFAEnabled\" = true WHERE \"IdUsuarios\" = :user_id"),
                {"user_id": user_id}
            )
            conn.commit()
        
        return True
        
    except Exception as e:
        print(f"Erro ao verificar MFA: {e}")
        return False

def verify_mfa_login(email: str, code: str) -> bool:
    """
    Verifica código MFA durante login
    """
    try:
        cache_key = f"mfa_login:{email}"
        mfa_data = cache_get(cache_key)
        
        if not mfa_data or mfa_data["code"] != code:
            return False
        
        # Remove código usado
        cache_delete(cache_key)
        
        return True
        
    except Exception as e:
        print(f"Erro ao verificar MFA login: {e}")
        return False
