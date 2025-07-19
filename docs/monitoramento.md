# Monitoramento e Observabilidade

## Grafana/Loki
- Acesse o Grafana em http://localhost:3001 (admin/admin)
- Adicione Loki como fonte de dados (`http://loki:3100`)
- Visualize logs dos containers com queries como `{container="backend"}`

## Prometheus
- Endpoint `/metrics` expõe métricas do backend (FastAPI).
- Monitore uso de CPU, memória, requisições, etc.

## Sentry
- Backend e frontend integrados com Sentry para rastreamento de erros e breadcrumbs.
- Configure sua DSN real em produção.

## Healthchecks
- Healthchecks configurados no docker-compose para todos os serviços críticos (backend, frontend, db, redis, rabbitmq, etc).

## Redis 8.0
- Monitore o status do Redis com `redis-cli info`.

## Celery
- Monitore tarefas com Flower (`celery -A app.core.celery_app.celery_app flower`).

## Logs estruturados
- Backend: loguru
- Frontend: Sentry breadcrumbs
- Logs centralizados via Loki/Grafana

## Como rodar tudo
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```