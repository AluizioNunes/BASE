from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import logging

from .core.config import settings
from app.core.monitoring import setup_monitoring
from app.core.logging_config import logger

# Configuração do logger
# logger = logging.getLogger(__name__) # This line is now redundant as logger is imported directly

# Cria a aplicação FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    description="Estrutura de API base para futuros projetos.",
    version="0.1.0",
    debug=settings.DEBUG,
    docs_url="/docs",  # Habilita o Swagger UI em /docs
    redoc_url="/redoc",  # Habilita o ReDoc em /redoc
    openapi_url="/openapi.json"  # URL para o esquema OpenAPI
)

logger.info("API inicializada com sucesso!")

# Middleware para compressão de respostas (recomendado para APIs REST)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],  # Em produção, restrinja para ["GET", "POST", "PUT", "DELETE"]
    allow_headers=["*"],  # Em produção, restrinja os cabeçalhos necessários
)

# Rota raiz
@app.get("/", tags=["Root"])
async def read_root():
    """
    Rota raiz da API.
    
    Retorna uma mensagem de boas-vindas.
    """
    return {"message": f"Bem-vindo à {settings.APP_NAME}!"}

# Importa e inclui os roteadores dos módulos
from app.modules.auth.routes import router as auth_router
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Autenticação"])
from app.modules.files.routes import router as files_router
app.include_router(files_router, prefix="/api/v1/files", tags=["Arquivos"])

# Middleware para log de requisições
@app.middleware("http")
async def log_requests(request, call_next):
    """
    Middleware para registrar informações sobre cada requisição recebida.
    """
    logger.info(f"Requisição recebida: {request.method} {request.url}")
    
    # Processa a requisição
    response = await call_next(request)
    
    # Registra o status da resposta
    logger.info(f"Resposta: {response.status_code}")
    
    return response

setup_monitoring(app)

# Documentação: todas as rotas devem ser versionadas usando /api/v1/
