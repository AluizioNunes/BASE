#!/bin/bash

# Script de backup automático para volumes Docker
# Autor: BASE System
# Data: $(date)

set -e

# Configurações
BACKUP_DIR="/var/backups/BASE"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="BASE_backup_${DATE}.tar.gz"
LOG_FILE="/var/log/BASE/backup.log"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Função de erro
error() {
    log "${RED}ERRO: $1${NC}"
    exit 1
}

# Função de sucesso
success() {
    log "${GREEN}SUCESSO: $1${NC}"
}

# Função de aviso
warning() {
    log "${YELLOW}AVISO: $1${NC}"
}

# Verifica se está rodando como root
if [[ $EUID -ne 0 ]]; then
   error "Este script deve ser executado como root"
fi

# Cria diretórios necessários
mkdir -p "$BACKUP_DIR"
mkdir -p "$(dirname "$LOG_FILE")"

log "=== Iniciando backup automático do BASE ==="

# Verifica se os containers estão rodando
if ! docker ps --format "table {{.Names}}" | grep -q "traefik"; then
    warning "Container Traefik não está rodando"
fi

if ! docker ps --format "table {{.Names}}" | grep -q "backend"; then
    warning "Container Backend não está rodando"
fi

if ! docker ps --format "table {{.Names}}" | grep -q "frontend"; then
    warning "Container Frontend não está rodando"
fi

# Lista de volumes para backup
VOLUMES=(
    "/var/lib/docker/BASE/volumes/Backend/pgsql_data"
    "/var/lib/docker/BASE/volumes/Backend/uploads_data"
    "/var/lib/docker/BASE/volumes/redis_data"
    "/var/lib/docker/BASE/volumes/rabbitmq_data"
    "/var/lib/docker/BASE/volumes/grafana_data"
    "/var/lib/docker/BASE/volumes/loki_data"
    "/var/lib/docker/BASE/volumes/traefik_data"
)

# Verifica se os volumes existem
log "Verificando volumes..."
for volume in "${VOLUMES[@]}"; do
    if [[ -d "$volume" ]]; then
        log "✓ Volume encontrado: $volume"
    else
        warning "Volume não encontrado: $volume"
    fi
done

# Cria backup dos volumes
log "Criando backup dos volumes..."
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

# Para containers que podem estar usando os volumes
log "Parando containers temporariamente..."
docker compose -f docker-compose.prod.yml stop backend db redis rabbitmq grafana loki 2>/dev/null || true

# Aguarda um pouco para garantir que os volumes foram liberados
sleep 5

# Cria o backup
if tar -czf "$BACKUP_PATH" -C /var/lib/docker/BASE/volumes .; then
    success "Backup criado com sucesso: $BACKUP_PATH"
    
    # Calcula tamanho do backup
    BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
    log "Tamanho do backup: $BACKUP_SIZE"
    
    # Calcula checksum para verificação
    BACKUP_CHECKSUM=$(sha256sum "$BACKUP_PATH" | cut -d' ' -f1)
    echo "$BACKUP_CHECKSUM" > "$BACKUP_PATH.sha256"
    log "Checksum SHA256: $BACKUP_CHECKSUM"
    
else
    error "Falha ao criar backup"
fi

# Reinicia os containers
log "Reiniciando containers..."
docker compose -f docker-compose.prod.yml start backend db redis rabbitmq grafana loki 2>/dev/null || true

# Limpa backups antigos
log "Limpando backups antigos..."
find "$BACKUP_DIR" -name "BASE_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "BASE_backup_*.tar.gz.sha256" -mtime +$RETENTION_DAYS -delete

# Lista backups restantes
log "Backups restantes:"
ls -lh "$BACKUP_DIR"/BASE_backup_*.tar.gz 2>/dev/null || log "Nenhum backup encontrado"

# Verifica espaço em disco
DISK_USAGE=$(df -h "$BACKUP_DIR" | tail -1 | awk '{print $5}' | sed 's/%//')
if [[ $DISK_USAGE -gt 80 ]]; then
    warning "Uso de disco alto: ${DISK_USAGE}%"
fi

# Estatísticas finais
BACKUP_COUNT=$(ls "$BACKUP_DIR"/BASE_backup_*.tar.gz 2>/dev/null | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1 || echo "0")

log "=== Backup concluído ==="
log "Total de backups: $BACKUP_COUNT"
log "Tamanho total: $TOTAL_SIZE"
log "Retenção: $RETENTION_DAYS dias"

# Notificação (opcional - você pode integrar com email, Slack, etc.)
if command -v curl &> /dev/null; then
    # Exemplo de notificação via webhook (descomente e configure)
    # curl -X POST -H "Content-Type: application/json" \
    #      -d "{\"text\":\"Backup BASE concluído: $BACKUP_NAME ($BACKUP_SIZE)\"}" \
    #      "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
    :
fi

success "Backup automático finalizado com sucesso!" 