import sentry_sdk
from fastapi import FastAPI
from prometheus_client import Counter, generate_latest
from fastapi.responses import Response

# Inicialização do Sentry (coloque sua DSN real em produção)
sentry_sdk.init(dsn="https://exemploPublicKey@o0.ingest.sentry.io/0")

# Exemplo de métrica Prometheus
REQUEST_COUNT = Counter('app_request_count', 'Contador de requisições')

def setup_monitoring(app: FastAPI):
    @app.middleware("http")
    async def count_requests(request, call_next):
        REQUEST_COUNT.inc()
        return await call_next(request)

    @app.get("/metrics")
    def metrics():
        return Response(generate_latest(), media_type="text/plain") 