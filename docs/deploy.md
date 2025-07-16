# Deploy do Projeto

## Como rodar
```bash
docker-compose up --build
```

## Serviços
- PostgreSQL 17.5
- Redis 8.0
- Backend FastAPI
- Frontend React
- RabbitMQ (se configurado)

## Deploy Automatizado (CI/CD)
- O workflow `.github/workflows/ci.yml` executa build, testes e deploy automático.

## Backup
- Inclua banco, uploads e Redis 8.0

## Versionamento de banco
- Use Alembic para migrações 