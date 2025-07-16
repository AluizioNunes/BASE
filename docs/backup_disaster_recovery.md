# Backup e Disaster Recovery

## Políticas de Backup
- Banco de dados PostgreSQL 17.5
- Redis 8.0 (dump.rdb)
- Pasta de uploads
- Versionamento de banco com Alembic

## Comandos de backup
- PostgreSQL:
```bash
pg_dump -U usuario -h localhost meubanco > backup_$(date +%F).sql
```
- Redis:
```bash
docker cp <container_redis>:/data/dump.rdb ./backup_redis_$(date +%F).rdb
```
- Uploads:
```bash
tar czf uploads_backup_$(date +%F).tar.gz uploads/
```

## Disaster Recovery
- Restaurar banco, Redis, uploads e aplicar migrações Alembic 