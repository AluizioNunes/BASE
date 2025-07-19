# Scripts de Automação

- Para rodar o backup automatizado:
```bash
bash scripts/backup.sh
```

- Para rodar ambiente de desenvolvimento:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

- Para rodar ambiente de produção:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

- Para acessar logs centralizados:
  - Acesse o Grafana em http://localhost:3001
  - Use Loki como fonte de dados para visualizar logs dos containers.

- Todos os scripts são compatíveis com docker-compose 3.9
- Inclua backup de banco, uploads e Redis 8.0
- Veja exemplos em `backup_disaster_recovery.md` 