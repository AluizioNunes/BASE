#!/bin/bash

# Script para configurar cron job de backup automático
# Autor: BASE System
# Data: $(date)

set -e

# Configurações
BACKUP_SCRIPT="/opt/BASE/scripts/backup-automated.sh"
CRON_USER="root"
BACKUP_SCHEDULE="0 2 * * *"  # Todos os dias às 2h da manhã
LOG_FILE="/var/log/BASE/cron-setup.log"

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

# Cria diretório de logs
mkdir -p "$(dirname "$LOG_FILE")"

log "=== Configurando Cron Job de Backup Automático ==="

# Verifica se o script de backup existe
if [[ ! -f "$BACKUP_SCRIPT" ]]; then
    error "Script de backup não encontrado: $BACKUP_SCRIPT"
fi

# Torna o script executável
chmod +x "$BACKUP_SCRIPT"
success "Script de backup configurado como executável"

# Verifica se o cron está instalado
if ! command -v crontab &> /dev/null; then
    warning "Cron não está instalado. Instalando..."
    
    # Detecta a distribuição Linux
    if command -v apt-get &> /dev/null; then
        apt-get update
        apt-get install -y cron
    elif command -v yum &> /dev/null; then
        yum install -y cronie
        systemctl enable crond
        systemctl start crond
    elif command -v dnf &> /dev/null; then
        dnf install -y cronie
        systemctl enable crond
        systemctl start crond
    else
        error "Não foi possível instalar o cron automaticamente"
    fi
fi

# Verifica se o serviço cron está rodando
if ! systemctl is-active --quiet cron 2>/dev/null && ! systemctl is-active --quiet crond 2>/dev/null; then
    warning "Serviço cron não está rodando. Iniciando..."
    
    if systemctl list-unit-files | grep -q cron.service; then
        systemctl enable cron
        systemctl start cron
    elif systemctl list-unit-files | grep -q crond.service; then
        systemctl enable crond
        systemctl start crond
    fi
fi

# Cria o arquivo de cron temporário
TEMP_CRON=$(mktemp)

# Adiciona comentário de identificação
echo "# Cron job para backup automático do BASE" >> "$TEMP_CRON"
echo "# Configurado em: $(date)" >> "$TEMP_CRON"
echo "# Script: $BACKUP_SCRIPT" >> "$TEMP_CRON"
echo "" >> "$TEMP_CRON"

# Adiciona o job de backup
echo "$BACKUP_SCHEDULE $BACKUP_SCRIPT >> /var/log/BASE/backup.log 2>&1" >> "$TEMP_CRON"

# Adiciona job de limpeza de logs antigos (manter apenas 30 dias)
echo "# Limpeza de logs antigos (manter apenas 30 dias)" >> "$TEMP_CRON"
echo "0 3 * * * find /var/log/BASE -name '*.log' -mtime +30 -delete" >> "$TEMP_CRON"

# Adiciona job de verificação de espaço em disco
echo "# Verificação de espaço em disco" >> "$TEMP_CRON"
echo "0 4 * * * df -h /var/backups/BASE | awk 'NR==2 {if(\$5+0>80) system(\"echo 'ALERTA: Disco com mais de 80% de uso' | mail -s 'Alerta de Disco' admin@base.com\")}'" >> "$TEMP_CRON"

# Instala o cron job
if crontab -u "$CRON_USER" "$TEMP_CRON"; then
    success "Cron job instalado com sucesso para o usuário $CRON_USER"
else
    error "Falha ao instalar cron job"
fi

# Remove arquivo temporário
rm -f "$TEMP_CRON"

# Verifica se o cron job foi instalado
if crontab -u "$CRON_USER" -l | grep -q "$BACKUP_SCRIPT"; then
    success "Cron job verificado e ativo"
else
    error "Cron job não foi instalado corretamente"
fi

# Cria script de monitoramento do cron
MONITOR_SCRIPT="/opt/BASE/scripts/monitor-cron.sh"
cat > "$MONITOR_SCRIPT" << 'EOF'
#!/bin/bash

# Script de monitoramento do cron job
LOG_FILE="/var/log/BASE/backup.log"
ALERT_EMAIL="admin@base.com"

# Verifica se o último backup foi executado nas últimas 24 horas
if [[ -f "$LOG_FILE" ]]; then
    LAST_BACKUP=$(stat -c %Y "$LOG_FILE")
    CURRENT_TIME=$(date +%s)
    DIFF_HOURS=$(( (CURRENT_TIME - LAST_BACKUP) / 3600 ))
    
    if [[ $DIFF_HOURS -gt 24 ]]; then
        echo "ALERTA: Último backup foi há $DIFF_HOURS horas" | mail -s "Alerta: Backup não executado" "$ALERT_EMAIL"
    fi
fi

# Verifica se há erros no log de backup
if [[ -f "$LOG_FILE" ]] && grep -q "ERRO" "$LOG_FILE"; then
    echo "ALERTA: Erros encontrados no log de backup" | mail -s "Alerta: Erro no backup" "$ALERT_EMAIL"
fi
EOF

chmod +x "$MONITOR_SCRIPT"

# Adiciona job de monitoramento
TEMP_MONITOR_CRON=$(mktemp)
crontab -u "$CRON_USER" -l > "$TEMP_MONITOR_CRON" 2>/dev/null || true
echo "# Monitoramento do cron job" >> "$TEMP_MONITOR_CRON"
echo "0 6 * * * $MONITOR_SCRIPT" >> "$TEMP_MONITOR_CRON"
crontab -u "$CRON_USER" "$TEMP_MONITOR_CRON"
rm -f "$TEMP_MONITOR_CRON"

success "Script de monitoramento configurado"

# Cria diretórios necessários
mkdir -p /var/backups/BASE
mkdir -p /var/log/BASE

# Configura permissões
chown -R root:root /var/backups/BASE
chown -R root:root /var/log/BASE
chmod -R 755 /var/backups/BASE
chmod -R 755 /var/log/BASE

# Testa o script de backup
log "Testando script de backup..."
if timeout 300 "$BACKUP_SCRIPT" > /dev/null 2>&1; then
    success "Script de backup testado com sucesso"
else
    warning "Script de backup falhou no teste (pode ser normal se não houver containers rodando)"
fi

# Mostra informações finais
log "=== Configuração Concluída ==="
log "Cron job configurado para executar: $BACKUP_SCHEDULE"
log "Script de backup: $BACKUP_SCRIPT"
log "Logs de backup: /var/log/BASE/backup.log"
log "Backups salvos em: /var/backups/BASE"
log "Monitoramento: $MONITOR_SCRIPT"

# Mostra cron jobs ativos
log "Cron jobs ativos para $CRON_USER:"
crontab -u "$CRON_USER" -l

success "Configuração de cron job concluída com sucesso!" 