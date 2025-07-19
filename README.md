# BASE – Template Full-Stack Profissional

Este projeto é um template completo para aplicações web modernas, pronto para ser reutilizado em novos projetos.

## Stack
- **Frontend:** React (internacionalização, acessibilidade, PWA, Sentry, testes, react-scripts@latest)
- **Backend:** FastAPI (modular, versionamento de API, logs estruturados, uploads seguros, LGPD/GDPR)
- **Banco de Dados:** PostgreSQL 17.5 (Alembic)
- **Cache:** Redis 8.0
- **Filas:** Celery + RabbitMQ
- **Monitoramento:** Sentry, Prometheus, Grafana/Loki
- **Proxy:** Traefik 3.4 (reverse proxy, HTTPS, roteamento)
- **Automação:** Docker Compose, scripts, CI/CD (GitHub Actions)

## Como usar como template
1. Clique em "Use this template" no GitHub para criar um novo repositório a partir desta BASE.
2. Siga o `docs/setup.md` para configurar variáveis de ambiente e rodar localmente.
3. Personalize nome, configs e siga o checklist de pós-clonagem.

## Como rodar
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build # desenvolvimento

docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build # produção
```

## Monitoramento e Logs
- Acesse o Grafana em http://localhost:3001 (admin/admin)
- Logs do backend e frontend disponíveis via Loki (query por container)
- Métricas Prometheus disponíveis em `/metrics` do backend
- Sentry integrado para rastreamento de erros

## Documentação
Veja a pasta `docs/` para detalhes sobre arquitetura, monitoramento, deploy, backup, LGPD/GDPR, API, segurança, acessibilidade e mais.

---
Consulte os READMEs das pastas e a documentação para detalhes de cada área.
