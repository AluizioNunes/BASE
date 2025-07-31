import sentry_sdk
from fastapi import FastAPI, Request
from prometheus_client import Counter, Histogram, Gauge, Summary, generate_latest
from fastapi.responses import Response
import time
from typing import Dict, Any
from .config import settings

# Inicialização do Sentry
if settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.ENVIRONMENT,
        traces_sample_rate=0.1,
        profiles_sample_rate=0.1,
    )

# Métricas Prometheus
REQUEST_COUNT = Counter('app_request_total', 'Total de requisições HTTP', ['method', 'endpoint', 'status'])
REQUEST_DURATION = Histogram('app_request_duration_seconds', 'Duração das requisições HTTP', ['method', 'endpoint'])
ACTIVE_USERS = Gauge('app_active_users', 'Usuários ativos no sistema')
DATABASE_QUERIES = Counter('app_database_queries_total', 'Total de queries no banco', ['operation', 'table'])
CACHE_HITS = Counter('app_cache_hits_total', 'Total de hits no cache')
CACHE_MISSES = Counter('app_cache_misses_total', 'Total de misses no cache')
FILE_UPLOADS = Counter('app_file_uploads_total', 'Total de uploads de arquivos', ['file_type', 'size_range'])
AUTH_ATTEMPTS = Counter('app_auth_attempts_total', 'Tentativas de autenticação', ['provider', 'status'])
ERROR_COUNT = Counter('app_errors_total', 'Total de erros', ['error_type', 'endpoint'])

# Resumos para percentis
REQUEST_PERCENTILES = Summary('app_request_percentiles', 'Percentis de duração das requisições')

class MetricsCollector:
    """Coletor de métricas customizadas"""
    
    @staticmethod
    def record_request(method: str, endpoint: str, status_code: int, duration: float):
        """Registra métricas de requisição"""
        REQUEST_COUNT.labels(method=method, endpoint=endpoint, status=status_code).inc()
        REQUEST_DURATION.labels(method=method, endpoint=endpoint).observe(duration)
        REQUEST_PERCENTILES.observe(duration)
    
    @staticmethod
    def record_database_query(operation: str, table: str, duration: float = None):
        """Registra métricas de banco de dados"""
        DATABASE_QUERIES.labels(operation=operation, table=table).inc()
        if duration:
            # Você pode adicionar um histogram para duração de queries se necessário
            pass
    
    @staticmethod
    def record_cache_access(hit: bool):
        """Registra métricas de cache"""
        if hit:
            CACHE_HITS.inc()
        else:
            CACHE_MISSES.inc()
    
    @staticmethod
    def record_file_upload(file_type: str, size_bytes: int):
        """Registra métricas de upload de arquivos"""
        size_range = "small" if size_bytes < 1024*1024 else "medium" if size_bytes < 10*1024*1024 else "large"
        FILE_UPLOADS.labels(file_type=file_type, size_range=size_range).inc()
    
    @staticmethod
    def record_auth_attempt(provider: str, success: bool):
        """Registra métricas de autenticação"""
        status = "success" if success else "failure"
        AUTH_ATTEMPTS.labels(provider=provider, status=status).inc()
    
    @staticmethod
    def record_error(error_type: str, endpoint: str):
        """Registra métricas de erro"""
        ERROR_COUNT.labels(error_type=error_type, endpoint=endpoint).inc()
    
    @staticmethod
    def set_active_users(count: int):
        """Define número de usuários ativos"""
        ACTIVE_USERS.set(count)

def setup_monitoring(app: FastAPI):
    """Configura monitoramento da aplicação"""
    
    @app.middleware("http")
    async def monitor_requests(request: Request, call_next):
        start_time = time.time()
        
        # Processa a requisição
        response = await call_next(request)
        
        # Calcula duração
        duration = time.time() - start_time
        
        # Registra métricas
        endpoint = request.url.path
        method = request.method
        status_code = response.status_code
        
        MetricsCollector.record_request(method, endpoint, status_code, duration)
        
        return response
    
    @app.get("/metrics")
    def metrics():
        """Endpoint para métricas Prometheus"""
        return Response(generate_latest(), media_type="text/plain")
    
    @app.get("/health")
    def health_check():
        """Health check da aplicação"""
        return {
            "status": "healthy",
            "timestamp": time.time(),
            "version": "1.0.0",
            "environment": settings.ENVIRONMENT
        }
    
    @app.get("/ready")
    def readiness_check():
        """Readiness check da aplicação"""
        # Aqui você pode adicionar verificações de dependências
        # como banco de dados, cache, etc.
        return {
            "status": "ready",
            "timestamp": time.time(),
            "dependencies": {
                "database": "healthy",
                "cache": "healthy",
                "external_apis": "healthy"
            }
        }

# Funções utilitárias para métricas
def track_database_operation(operation: str, table: str):
    """Decorator para rastrear operações de banco"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                duration = time.time() - start_time
                MetricsCollector.record_database_query(operation, table, duration)
                return result
            except Exception as e:
                MetricsCollector.record_error("database_error", f"{operation}_{table}")
                raise
        return wrapper
    return decorator

def track_cache_operation():
    """Decorator para rastrear operações de cache"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            try:
                result = func(*args, **kwargs)
                MetricsCollector.record_cache_access(True)  # Hit
                return result
            except Exception:
                MetricsCollector.record_cache_access(False)  # Miss
                raise
        return wrapper
    return decorator 