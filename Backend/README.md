# Backend – FastAPI

## Principais recursos
- Modularização por domínio
- Versionamento de API (`/api/v1/`)
- Logs estruturados com loguru
- Cache com Redis 8.0
- Filas assíncronas com Celery + RabbitMQ
- Versionamento de banco com Alembic
- Upload/download seguro de arquivos
- Políticas LGPD/GDPR
- Monitoramento com Sentry e Prometheus
- **Todas as dependências estão atualizadas para as versões mais recentes, incluindo FastAPI, psycopg-binary (psycopg3), etc.**

## Como rodar

```bash
docker-compose up --build
```

## Cache e Filas
- O Redis 8.0 é usado para cache e backend do Celery.
- O Celery usa RabbitMQ como broker.
- Veja exemplos em `app/core/cache.py` e `app/core/celery_app.py`.

## Versionamento de banco
- Use Alembic para criar e aplicar migrações.
- Veja instruções em `alembic.ini`, `migrations/` e `docs/setup.md`.

## Upload seguro
- Rotas em `modules/files/routes.py`.
- Documentação em `docs/api/README.md`.

## LGPD/GDPR
- Veja `docs/lgpd_gdpr.md` para políticas e recomendações.

## Logs estruturados
- Veja exemplos em `app/core/logging_config.py` e `docs/monitoramento.md`. 