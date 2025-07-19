# Arquitetura do Sistema

```mermaid
graph TD;
  Usuario["Usuário"] -->|HTTP/HTTPS| Proxy["Traefik 3.4 (Reverse Proxy)"]
  Proxy -->|/| Frontend["Frontend (React, PWA, i18n, Service Worker)"]
  Proxy -->|/api| Backend["Backend (FastAPI, JWT via Cookie)"]
  Backend -->|SQL| DB[("PostgreSQL 17.5")]
  Backend -->|/metrics| Prometheus[("Prometheus")]
  Backend -->|Sentry| Sentry[("Sentry")]
  Frontend -->|Sentry| Sentry
  Backend -->|Cache| Redis[("Redis 8.0")]
  Backend -->|Fila| RabbitMQ[("RabbitMQ")]
  Backend -->|Tarefas| Celery[("Celery Workers")]
  Backend -->|Upload| Files[("Upload Seguro")]
  Backend -->|Privacidade| LGPD[("LGPD/GDPR")]
  Proxy -->|Healthchecks| Health[("Healthchecks")]
  Backend -->|Logs| Loki[("Loki")]
  Loki --> Grafana[("Grafana")]
```

## Serviços e recursos
- Reverse proxy (Traefik 3.4) para HTTPS, roteamento e segurança
- Healthchecks para todos os serviços
- Volumes persistentes para uploads e banco
- Monitoramento centralizado (Grafana/Loki, Prometheus, Sentry)
- Deploy blue/green, backup automatizado, auditoria de dependências
- Autenticação moderna via cookies httpOnly
- Frontend PWA, internacionalização, acessibilidade, testes automatizados
- Pronto para reuso como template 