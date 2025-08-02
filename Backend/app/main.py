from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded


from .core.config import settings
from app.core.monitoring import setup_monitoring
from app.core.logging_config import logger



# Configuração do Rate Limiter
limiter = Limiter(key_func=get_remote_address)

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

# Configura o rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

logger.info("API inicializada com sucesso!")

# Middleware para compressão de respostas (recomendado para APIs REST)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
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

# Endpoint de health check
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Endpoint de verificação de saúde da API.
    
    Retorna o status da aplicação.
    """
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": "0.1.0"
    }

# Endpoint de health check com prefixo /api
@app.get("/api/health", tags=["Health"])
async def api_health_check():
    """
    Endpoint de verificação de saúde da API com prefixo /api.
    
    Retorna o status da aplicação.
    """
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": "0.1.0"
    }

# Importa e inclui os roteadores dos módulos
from app.modules.auth.routes import router as auth_router
app.include_router(auth_router, prefix="/api/auth", tags=["Autenticação"])
from app.modules.files.routes import router as files_router
app.include_router(files_router, prefix="/api/files", tags=["Arquivos"])

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

# Documentação: todas as rotas devem ser versionadas usando /api/
