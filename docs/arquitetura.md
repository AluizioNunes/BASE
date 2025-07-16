# Arquitetura do Sistema

```mermaid
graph TD;
  Usuario["Usuário"] -->|HTTP| Frontend["Frontend (React)"]
  Frontend -->|REST API| Backend["Backend (FastAPI)"]
  Backend -->|SQL| DB[("PostgreSQL 17.5")]
  Backend -->|/metrics| Prometheus[("Prometheus")]
  Backend -->|Sentry| Sentry[("Sentry")]
  Frontend -->|Sentry| Sentry
  Backend -->|Cache| Redis[("Redis 8.0")]
  Backend -->|Fila| RabbitMQ[("RabbitMQ")]
  Backend -->|Tarefas| Celery[("Celery Workers")]
  Backend -->|Upload| Files[("Upload Seguro")]
  Backend -->|Privacidade| LGPD[("LGPD/GDPR")]
```

## Serviços
- **Redis 8.0:** cache e backend do Celery
- **RabbitMQ:** filas para tarefas assíncronas
- **Celery:** processamento assíncrono
- **Alembic:** versionamento de banco
- **Upload seguro:** rotas protegidas para arquivos
- **LGPD/GDPR:** políticas e endpoints de privacidade
- **docker-compose 3.9:** orquestração de todos os serviços 