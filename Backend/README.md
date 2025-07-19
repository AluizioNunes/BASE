# Backend – FastAPI (Template)

## Stack
- Modularização por domínio
- Versionamento de API (`/api/v1/`)
- Logs estruturados com loguru
- Cache com Redis 8.0
- Filas assíncronas com Celery + RabbitMQ
- Versionamento de banco com Alembic
- Upload/download seguro de arquivos
- Políticas LGPD/GDPR
- Monitoramento com Sentry e Prometheus
- Reverse proxy com Traefik 3.4

## Como rodar
```bash
docker-compose up --build
```

## Observações
- Redis 8.0 para cache e backend do Celery.
- Celery usa RabbitMQ como broker.
- Alembic para versionamento de banco.
- Upload seguro em `modules/files/routes.py`.
- LGPD/GDPR em `docs/lgpd_gdpr.md`.
- Logs estruturados em `app/core/logging_config.py`.

Consulte a documentação em `../docs/` para detalhes avançados. 