from pydantic_settings import BaseSettings
from pydantic import AnyUrl, validator, field_validator
from typing import Optional, List, Union
import os
import json

class Settings(BaseSettings):
    # Configurações da Aplicação
    APP_NAME: str = os.getenv("APP_NAME", "BASE")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Configurações do Banco de Dados
    DB_HOST: str = os.getenv("DB_HOST", "10.10.255.111")
    DB_PORT: str = os.getenv("DB_PORT", "5432")
    DB_NAME: str = os.getenv("DB_NAME", "BASE")
    DB_USER: str = os.getenv("DB_USER", "BASE")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "BASE")
    DB_SCHEMA: str = os.getenv("DB_SCHEMA", "BASE")
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"postgresql+psycopg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    SQLALCHEMY_LOG_LEVEL: str = os.getenv("SQLALCHEMY_LOG_LEVEL", "INFO")
    
    # Configurações de Autenticação JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "BASE_SECRET_KEY_CHANGE_IN_PRODUCTION")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # Configurações de CORS
    BACKEND_CORS_ORIGINS: str = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:3000")
    
    # Configurações do Redis
    REDIS_HOST: str = os.getenv("REDIS_HOST", "redis")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB: int = int(os.getenv("REDIS_DB", "0"))
    REDIS_PASSWORD: str = os.getenv("REDIS_PASSWORD", "BASE")
    
    # Configurações do RabbitMQ
    RABBITMQ_HOST: str = os.getenv("RABBITMQ_HOST", "rabbitmq")
    RABBITMQ_PORT: int = int(os.getenv("RABBITMQ_PORT", "5672"))
    RABBITMQ_USER: str = os.getenv("RABBITMQ_USER", "BASE")
    RABBITMQ_PASSWORD: str = os.getenv("RABBITMQ_PASSWORD", "BASE")
    
    # Configurações do Sentry
    SENTRY_DSN: Optional[str] = os.getenv("SENTRY_DSN", None)
    
    # Configurações do Elastic APM
    ELASTIC_APM_SERVER_URL: Optional[str] = os.getenv("ELASTIC_APM_SERVER_URL", None)
    ELASTIC_APM_SECRET_TOKEN: Optional[str] = os.getenv("ELASTIC_APM_SECRET_TOKEN", None)
    
    # Configurações de Upload
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", str(10 * 1024 * 1024)))
    ALLOWED_EXTENSIONS: List[str] = os.getenv("ALLOWED_EXTENSIONS", ".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx").split(",")
    
    # Configurações OAuth
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    GOOGLE_REDIRECT_URI: str = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/v1/auth/google/callback")
    
    GITHUB_CLIENT_ID: str = os.getenv("GITHUB_CLIENT_ID", "")
    GITHUB_CLIENT_SECRET: str = os.getenv("GITHUB_CLIENT_SECRET", "")
    GITHUB_REDIRECT_URI: str = os.getenv("GITHUB_REDIRECT_URI", "http://localhost:8000/api/v1/auth/github/callback")
    
    @property
    def CORS_ORIGINS(self) -> List[str]:
        """Retorna a lista de origens CORS"""
        if isinstance(self.BACKEND_CORS_ORIGINS, str):
            return [i.strip() for i in self.BACKEND_CORS_ORIGINS.split(",") if i.strip()]
        elif isinstance(self.BACKEND_CORS_ORIGINS, list):
            return self.BACKEND_CORS_ORIGINS
        else:
            return ["http://localhost:3000"]
    
    @field_validator("ALLOWED_EXTENSIONS", mode="before")
    @classmethod
    def assemble_allowed_extensions(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            # Se for uma string, divide por vírgula
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        else:
            return [str(v)]
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        case_sensitive = True
        # Configurações para evitar problemas com parsing JSON
        json_schema_extra = {
            "example": {
                "BACKEND_CORS_ORIGINS": "http://localhost:3000,http://10.10.255.111",
                "ALLOWED_EXTENSIONS": ".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx"
            }
        }

# Instância global de configurações
settings = Settings()

# Configuração de log do SQLAlchemy
import logging
logging.basicConfig(level=settings.SQLALCHEMY_LOG_LEVEL)
logging.getLogger('sqlalchemy.engine').setLevel(settings.SQLALCHEMY_LOG_LEVEL)
