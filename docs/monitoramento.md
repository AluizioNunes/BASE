# Monitoramento e Observabilidade

## Grafana/Loki
- Acesse o Grafana em http://localhost:3001 (admin/admin)
- Adicione Loki como fonte de dados (`http://loki:3100`)
- Visualize logs dos containers com queries como `{container="backend"}`

## Prometheus
- Endpoint `/metrics` expõe métricas do backend (FastAPI 0.116.1).
- Monitore uso de CPU, memória, requisições, etc.

## Sentry
- Backend e frontend integrados com Sentry 2.33.0 para rastreamento de erros e breadcrumbs.
- Configure sua DSN real em produção.

## Healthchecks
- Healthchecks configurados no docker-compose para todos os serviços críticos (backend, frontend, db, redis, rabbitmq, etc).

## Redis
- Redis Server: 8.0 (serviço)
- Redis Client (Python): 6.2.0 (biblioteca)
- Monitore o status do Redis Server com `redis-cli info`.

## Celery 5.5.3
- Monitore tarefas com Flower (`celery -A app.core.celery_app.celery_app flower`).

## Logs estruturados
- Backend: loguru 0.7.3
- Frontend: Sentry 2.33.0 breadcrumbs
- Logs centralizados via Loki/Grafana

## Como rodar tudo
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```