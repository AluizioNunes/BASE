# Backend – FastAPI

## Stack
- FastAPI
- Modularização por domínio (ex: auth, files)
- Versionamento de API (`/api/v1/`)
- Logs estruturados com loguru
- Cache com Redis
- Filas assíncronas com Celery + RabbitMQ
- Versionamento de banco com Alembic
- Upload/download seguro de arquivos
- Políticas LGPD/GDPR
- Monitoramento com Sentry e Prometheus
- Reverse proxy com Traefik

## Estrutura
```
Backend/
  app/
    core/         # Configurações, cache, celery, logging, monitoring, database
    modules/      # auth, files, (adicione outros domínios aqui)
  migrations/     # Alembic
  scripts/        # Scripts utilitários (crie seus próprios)
  tests/          # Testes automatizados
  uploads/        # Upload seguro de arquivos
```

## Como rodar
```bash
cd Backend
python -m venv venv
source venv/bin/activate  # ou .\venv\Scripts\activate no Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Como rodar com Docker Compose
```bash
docker-compose -f ../docker-compose.yml -f ../docker-compose.prod.yml up --build
```

## Testes
```bash
pytest
```

## Migrações de banco
```bash
alembic upgrade head
```

## Observações
- Redis para cache e backend do Celery.
- Celery usa RabbitMQ como broker.
- Alembic para versionamento de banco.
- Upload seguro em `modules/files/routes.py`.
- LGPD/GDPR em `docs/lgpd_gdpr.md`.
- Logs estruturados em `app/core/logging_config.py`.
- **Crie scripts reais de backup/restore em `scripts/` conforme sua necessidade.**

Consulte a documentação em `../docs/` para detalhes avançados. 