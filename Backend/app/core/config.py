from pydantic_settings import BaseSettings
from pydantic import AnyUrl
from typing import Optional

class Settings(BaseSettings):
    # Configurações da Aplicação
    APP_NAME: str = "API Base"
    DEBUG: bool = False
    
    # Configurações do Banco de Dados
    DATABASE_URL: AnyUrl
    SQLALCHEMY_LOG_LEVEL: str = "INFO"
    
    # Configurações de Autenticação JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Configurações de CORS (opcional, pode ser sobrescrito no main.py)
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'  # Garante a leitura correta de caracteres especiais
        case_sensitive = True  # Diferencia maiúsculas e minúsculas nas variáveis de ambiente

# Instância global de configurações
settings = Settings()

# Configuração de log do SQLAlchemy
import logging
logging.basicConfig(level=settings.SQLALCHEMY_LOG_LEVEL)
logging.getLogger('sqlalchemy.engine').setLevel(settings.SQLALCHEMY_LOG_LEVEL)
