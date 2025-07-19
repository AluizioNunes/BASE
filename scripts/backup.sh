#!/bin/bash
# Backup PostgreSQL
PG_CONTAINER=$(docker ps --filter ancestor=postgres:17.5 --format "{{.Names}}")
docker exec $PG_CONTAINER pg_dump -U usuario meubanco > backup_pg_$(date +%F).sql

# Backup Redis
REDIS_CONTAINER=$(docker ps --filter ancestor=redis:8.0 --format "{{.Names}}")
docker exec $REDIS_CONTAINER redis-cli save
docker cp $REDIS_CONTAINER:/data/dump.rdb ./backup_redis_$(date +%F).rdb

# Backup uploads
UPLOADS_DIR=backend/app/uploads
if [ -d "$UPLOADS_DIR" ]; then
  tar czf uploads_backup_$(date +%F).tar.gz $UPLOADS_DIR
fi 