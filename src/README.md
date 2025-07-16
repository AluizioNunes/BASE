# Frontend (React)

## Principais recursos
- Internacionalização (i18n)
- Acessibilidade
- Logs estruturados com Sentry breadcrumbs
- Testes automatizados
- Integração com backend versionado e seguro

## Como rodar

```bash
docker-compose up --build
```

## Logs estruturados
- Use a função `logBreadcrumb` do serviço Sentry para registrar eventos importantes.
- Veja exemplos em `services/sentry.ts` e `docs/monitoramento.md`.

## Internacionalização
- Veja exemplos em `i18n/` e instruções neste README.

## Acessibilidade
- Veja recomendações em `docs/acessibilidade.md`. 