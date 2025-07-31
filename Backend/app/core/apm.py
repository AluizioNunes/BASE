"""
Módulo de APM (Application Performance Monitoring) com Elastic APM
"""
import elasticapm
from elasticapm.contrib.starlette import ElasticAPM
from fastapi import FastAPI
from .config import settings

# Configuração do Elastic APM
def setup_apm(app: FastAPI):
    """Configura Elastic APM para monitoramento de performance"""
    if settings.ELASTIC_APM_SERVER_URL:
        elasticapm.init(
            service_name=settings.APP_NAME,
            server_url=settings.ELASTIC_APM_SERVER_URL,
            secret_token=settings.ELASTIC_APM_SECRET_TOKEN,
            environment=settings.ENVIRONMENT,
            service_version="1.0.0",
            capture_body=True,
            capture_headers=True,
            transaction_max_spans=50,
            span_frames_min_duration_ms=5,
            stack_trace_limit=10,
        )
        
        # Adiciona middleware do APM
        app.add_middleware(ElasticAPM, client=elasticapm.get_client())
        
        # Configura handlers de erro
        @app.exception_handler(Exception)
        async def apm_exception_handler(request, exc):
            elasticapm.capture_exception()
            raise exc 