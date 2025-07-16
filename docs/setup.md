# Guia de Setup para Novos Desenvolvedores

## 1. Clonar o repositório
```bash
git clone <url-do-repo>
```

## 2. Rodar tudo com Docker Compose
```bash
docker-compose up --build
```

## 3. Variáveis de ambiente
- Configure `.env.example` para backend, frontend, banco, Redis, etc.

## 4. Versionamento de banco
- Instale o Alembic:
```bash
pip install alembic
```
- Crie e aplique migrações conforme necessário.

## 5. Monitoramento
- Sentry, Prometheus, Flower (Celery), Redis-cli

## 6. Dependências
- Todas as dependências do projeto estão atualizadas para as versões mais recentes, incluindo FastAPI, psycopg-binary (psycopg3), etc. 