# Monitoramento e Observabilidade

## Sentry
- Backend e frontend integrados com Sentry para rastreamento de erros e breadcrumbs.

## Prometheus
- Endpoint `/metrics` expõe métricas do backend.

## Redis 8.0
- Monitore o status do Redis com `redis-cli info`.

## Celery
- Monitore tarefas com Flower (`celery -A app.core.celery_app.celery_app flower`).

## Logs estruturados
- Backend: loguru
- Frontend: Sentry breadcrumbs

## Como rodar tudo
```bash
docker-compose up --build
```