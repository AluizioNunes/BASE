from fastapi import APIRouter, Response, Depends, HTTPException
from pydantic import BaseModel
from app.modules.auth.services import authenticate_user, create_access_token, get_current_user
import os

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(data: LoginRequest, response: Response):
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
