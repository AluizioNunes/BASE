from pydantic import BaseModel, EmailStr, validator, Field
from typing import Optional, List
import re

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    nome: str = Field(..., min_length=2, max_length=300)
    cpf: str = Field(..., min_length=11, max_length=14)
    funcao: str = Field(..., min_length=2, max_length=300)
    email: EmailStr
    usuario: str = Field(..., min_length=3, max_length=200)
    password: str = Field(..., min_length=8)
    perfil: str = Field(..., min_length=2, max_length=300)
    cadastrante: str = Field(..., min_length=2, max_length=400)

    @validator('cpf')
    def validate_cpf(cls, v):
        # Remove caracteres não numéricos
        cpf_clean = re.sub(r'[^0-9]', '', v)
        if len(cpf_clean) != 11:
            raise ValueError('CPF deve ter 11 dígitos')
        
        # Validação básica de CPF
        if cpf_clean == cpf_clean[0] * 11:
            raise ValueError('CPF inválido')
        
        # Calcula dígitos verificadores
        soma = sum(int(cpf_clean[i]) * (10 - i) for i in range(9))
        resto = soma % 11
        digito1 = 0 if resto < 2 else 11 - resto
        
        soma = sum(int(cpf_clean[i]) * (11 - i) for i in range(10))
        resto = soma % 11
        digito2 = 0 if resto < 2 else 11 - resto
        
        if cpf_clean[-2:] != f"{digito1}{digito2}":
            raise ValueError('CPF inválido')
        
        return v

    @validator('usuario')
    def validate_usuario(cls, v):
        if not re.match(r'^[a-zA-Z0-9._-]+$', v):
            raise ValueError('Nome de usuário deve conter apenas letras, números, pontos, hífens e underscores')
        return v

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

class MFARequest(BaseModel):
    code: str = Field(..., min_length=6, max_length=6)

    @validator('code')
    def validate_code(cls, v):
        if not v.isdigit():
            raise ValueError('Código MFA deve conter apenas números')
        return v

class MFASetupRequest(BaseModel):
    code: str = Field(..., min_length=6, max_length=6)

    @validator('code')
    def validate_code(cls, v):
        if not v.isdigit():
            raise ValueError('Código MFA deve conter apenas números')
        return v

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    perfil: str
    funcao: str
    usuario: str
    mfa_enabled: bool = False

class LoginResponse(BaseModel):
    message: str
    user: Optional[UserResponse] = None
    requires_mfa: bool = False

class RegisterResponse(BaseModel):
    id: int
    email: str
    name: str
    message: str

class PasswordValidationResponse(BaseModel):
    valid: bool
    errors: List[str]
    warnings: List[str]
    score: int

class MFASetupResponse(BaseModel):
    mfa_code: str
    message: str

class PasswordResetResponse(BaseModel):
    message: str
    token: Optional[str] = None

class AuditLogResponse(BaseModel):
    id: int
    email: str
    success: bool
    ip_address: Optional[str]
    user_agent: Optional[str]
    timestamp: str

class LoginAuditResponse(BaseModel):
    total_attempts: int
    successful_attempts: int
    failed_attempts: int
    recent_attempts: List[AuditLogResponse]

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class ErrorResponse(BaseModel):
    detail: str
    errors: Optional[List[str]] = None
