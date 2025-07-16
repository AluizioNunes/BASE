# Projeto Base Full-Stack

Este projeto é uma base moderna para aplicações web, pronta para produção, colaboração e crescimento.

## Principais Tecnologias
- **Frontend:** React (internacionalização, acessibilidade, Sentry breadcrumbs, testes)
- **Backend:** FastAPI (modular, versionamento de API, logs estruturados com loguru, upload seguro, LGPD/GDPR)
- **Banco de Dados:** PostgreSQL 17.5 (com versionamento Alembic)
- **Cache:** Redis 8.0
- **Filas:** Celery + RabbitMQ
- **Monitoramento:** Sentry, Prometheus, logs estruturados
- **Automação:** Docker Compose (versão 3.9), scripts de setup/dev/deploy, CI/CD com GitHub Actions
- **Drivers e dependências:** Todas as dependências estão atualizadas para as versões mais recentes, incluindo FastAPI, psycopg-binary (psycopg3), etc.

## Como rodar

```bash
docker-compose up --build
```

Isso irá subir:
- PostgreSQL 17.5
- Redis 8.0
- RabbitMQ (se configurado)
- Backend FastAPI
- Frontend React

## Documentação
Veja a pasta `docs/` para detalhes sobre arquitetura, monitoramento, deploy, backup, LGPD/GDPR, API, segurança, acessibilidade e mais.

## Destaques
- Logs estruturados em todo o stack
- Versionamento de banco com Alembic
- Upload/download seguro de arquivos
- Políticas de privacidade e conformidade LGPD/GDPR
- Cache e filas prontos para produção
- Deploy automatizado e scripts de automação
- **Dependências sempre atualizadas para as versões mais recentes**

---
Consulte os READMEs das pastas e a documentação para detalhes de cada área.
