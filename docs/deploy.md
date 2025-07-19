# Deploy do Projeto

## Como rodar (produção)
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

## Serviços
- Reverse proxy (Traefik 3.4) para HTTPS e roteamento
- PostgreSQL 17.5
- Redis 8.0
- Backend FastAPI
- Frontend React (PWA, service worker, fallback offline)
- RabbitMQ (se configurado)
- Grafana, Loki, Prometheus, Sentry

## Deploy Automatizado (CI/CD)
- O workflow `.github/workflows/ci.yml` executa build, testes e deploy automático.
- Variáveis de ambiente devem ser configuradas nos secrets do repositório.

## Backup
- Banco, uploads e Redis 8.0
- Agende backups automáticos (veja `docs/backup_disaster_recovery.md`)

## Healthchecks
- Healthchecks configurados no docker-compose para todos os serviços

## Deploy blue/green
- Deploys sem downtime para produção

## Observações
- Separe ambientes (dev, staging, prod) por arquivos de compose e variáveis de ambiente.
- Consulte o README do frontend e backend para detalhes de build e integração. 