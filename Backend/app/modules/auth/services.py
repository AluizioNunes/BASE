from passlib.hash import bcrypt
from jose import jwt, JWTError
from fastapi import HTTPException, status, Request
import os
from datetime import datetime, timedelta

# Hash fixo gerado para senha 'senha123'
fake_users_db = {
    "usuario@exemplo.com": {
        "email": "usuario@exemplo.com",
        "hashed_password": "$2b$12$iv6nZxw0Qnnt6Ut8eJQGj.eCHz49H5sBst/3oPyUm317QFI6nsyYG",
        "name": "Usuário Exemplo"
    }
}

SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

def authenticate_user(email: str, password: str):
    user = fake_users_db.get(email)
    if not user or not bcrypt.verify(password, user["hashed_password"]):
        return None
    return user

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Não autenticado")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
    user = fake_users_db.get(email)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário não encontrado")
    return {"email": user["email"], "name": user["name"]}
