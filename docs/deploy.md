# Deploy do Projeto

## Como rodar (produção)
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

## Serviços e versões
- Reverse proxy (Traefik 3.4) para HTTPS e roteamento
- PostgreSQL 17.5
- Redis Server: 8.0 (serviço, definido no docker-compose.yml)
- Redis Client (Python): 6.2.0 (biblioteca, ver requirements-locked.txt)
- Backend FastAPI 0.116.1
- Frontend React 19.1.0 + Vite 7.0.5 (PWA via vite-plugin-pwa 1.0.1)
- RabbitMQ (ver docker-compose)
- Grafana, Loki, Prometheus, Sentry 2.33.0

## Deploy Automatizado (CI/CD)
- O workflow `.github/workflows/ci.yml` executa build, testes e deploy automático.
- Variáveis de ambiente devem ser configuradas nos secrets do repositório.

## Backup
- Banco, uploads e Redis 6.2.0
- Agende backups automáticos (veja `docs/backup_disaster_recovery.md`)

## Healthchecks
- Healthchecks configurados no docker-compose para todos os serviços

## Deploy blue/green
- Deploys sem downtime para produção

## Observações
- Separe ambientes (dev, staging, prod) por arquivos de compose e variáveis de ambiente.
- Consulte o README do frontend e backend para detalhes de build e integração. 