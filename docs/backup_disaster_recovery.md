# Backup e Disaster Recovery

## Políticas de Backup
- Banco de dados PostgreSQL 17.5
- Redis 8.0 (dump.rdb)
- Pasta de uploads
- Versionamento de banco com Alembic
- Volumes Docker persistentes
- Backups automáticos agendados (cron, scripts)

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
- Volumes Docker:
```bash
docker run --rm --volumes-from <container> -v $(pwd):/backup busybox tar czf /backup/volume_backup.tar.gz /caminho/do/volume
```

## Disaster Recovery
- Restaurar banco, Redis, uploads e aplicar migrações Alembic
- Testar restore periodicamente
- Documentar procedimentos de emergência 