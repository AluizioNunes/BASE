from pydantic_settings import BaseSettings
from pydantic import AnyUrl, validator
from typing import Optional, List
import os

class Settings(BaseSettings):
    # Configurações da Aplicação
    APP_NAME: str = "API Base"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    
    # Configurações do Banco de Dados
    DATABASE_URL: str = "postgresql://BASE:BASE@db:5432/BASE"
    SQLALCHEMY_LOG_LEVEL: str = "INFO"
    
    # Configurações de Autenticação JWT
    SECRET_KEY: str = "BASE_SECRET_KEY_CHANGE_IN_PRODUCTION"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 horas
    
    # Configurações de CORS
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000"
    
    # Configurações do Redis
    REDIS_HOST: str = "redis"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: str = "BASE"
    
    # Configurações do RabbitMQ
    RABBITMQ_HOST: str = "rabbitmq"
    RABBITMQ_PORT: int = 5672
    RABBITMQ_USER: str = "BASE"
    RABBITMQ_PASSWORD: str = "BASE"
    
    # Configurações do Sentry
    SENTRY_DSN: Optional[str] = None
    
    # Configurações do Elastic APM
    ELASTIC_APM_SERVER_URL: Optional[str] = None
    ELASTIC_APM_SECRET_TOKEN: Optional[str] = None
    
    # Configurações de Upload
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".gif", ".pdf", ".doc", ".docx", ".xls", ".xlsx"]
    
    # Configurações OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/google/callback"
    
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    GITHUB_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/github/callback"
    
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v):
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        case_sensitive = True

# Instância global de configurações
settings = Settings()

# Configuração de log do SQLAlchemy
import logging
logging.basicConfig(level=settings.SQLALCHEMY_LOG_LEVEL)
logging.getLogger('sqlalchemy.engine').setLevel(settings.SQLALCHEMY_LOG_LEVEL)
