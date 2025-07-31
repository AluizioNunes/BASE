from fastapi import APIRouter, Response, Depends, HTTPException, Request
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.modules.auth.services import authenticate_user, create_access_token, get_current_user
from app.modules.auth.oauth import authenticate_oauth_user, get_oauth_url
import os

limiter = Limiter(key_func=get_remote_address)

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
@limiter.limit("5/minute")
def login(data: LoginRequest, response: Response, request: Request):
    user = authenticate_user(data.email, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    access_token = create_access_token({"sub": user["email"]})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=bool(os.getenv("PRODUCTION", False)),
        samesite="lax",
        max_age=60*60*24  # 1 dia
    )
    return {"message": "Login realizado com sucesso"}

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logout realizado com sucesso"}

@router.get("/profile")
def profile(user=Depends(get_current_user)):
    return user

# Rotas OAuth
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
