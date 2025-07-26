# 💾 Backup e Disaster Recovery

Este documento descreve a estratégia de backup e recuperação de desastres do sistema BASE.

## 🎯 Visão Geral

O sistema BASE utiliza uma estratégia de backup em camadas para garantir a segurança dos dados:
- **Backup Automático** dos volumes Docker
- **Backup Incremental** para eficiência
- **Teste de Restauração** regular
- **Retenção Configurável** de backups

## 📁 Estrutura de Volumes

### Volumes Persistentes

```
/var/lib/docker/BASE/volumes/
├── grafana_data/      # Dashboards e configurações Grafana
├── loki_data/         # Logs centralizados
├── postgres_data/     # Banco de dados PostgreSQL
├── redis_data/        # Cache Redis
├── rabbitmq_data/     # Filas de mensagens RabbitMQ
├── uploads_data/      # Arquivos enviados pelos usuários
└── traefik_data/      # Certificados SSL e configurações
```

### Importância por Volume

| Volume | Crítico | Frequência | Tamanho |
|--------|---------|------------|---------|
| `postgres_data` | 🔴 Sim | Diário | ~100MB-1GB |
| `uploads_data` | 🔴 Sim | Diário | Variável |
| `grafana_data` | 🟡 Médio | Semanal | ~50MB |
| `loki_data` | 🟡 Médio | Semanal | ~100MB-500MB |
| `redis_data` | 🟢 Baixo | Semanal | ~10MB |
| `rabbitmq_data` | 🟢 Baixo | Semanal | ~10MB |
| `traefik_data` | 🟡 Médio | Mensal | ~1MB |

## 🔧 Scripts de Backup

### Script de Backup Automático

```bash
#!/bin/bash
# scripts/backup.sh

# Configurações
BACKUP_DIR="/var/backups/BASE"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Backup completo dos volumes
echo "Iniciando backup dos volumes..."
tar -czf $BACKUP_DIR/volumes_$DATE.tar.gz \
  -C /var/lib/docker/BASE volumes/

# Backup incremental (apenas mudanças)
echo "Criando backup incremental..."
rsync -av --delete \
  /var/lib/docker/BASE/volumes/ \
  $BACKUP_DIR/incremental/

# Limpar backups antigos
echo "Limpando backups antigos..."
find $BACKUP_DIR -name "volumes_*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup concluído: $BACKUP_DIR/volumes_$DATE.tar.gz"
```

### Script de Restauração

```bash
#!/bin/bash
# scripts/restore.sh

# Configurações
BACKUP_DIR="/var/backups/BASE"
BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Uso: $0 <arquivo_backup>"
    echo "Exemplo: $0 volumes_20241201_120000.tar.gz"
    exit 1
fi

# Parar containers
echo "Parando containers..."
docker compose -f docker-compose.prod.yml down

# Restaurar volumes
echo "Restaurando volumes..."
tar -xzf $BACKUP_DIR/$BACKUP_FILE -C /var/lib/docker/BASE/

# Aplicar permissões corretas
echo "Aplicando permissões..."
sudo chown -R 472:472 /var/lib/docker/BASE/volumes/grafana_data
sudo chown -R 1000:1000 /var/lib/docker/BASE/volumes/loki_data
sudo chown -R 999:999 /var/lib/docker/BASE/volumes/postgres_data
sudo chown -R 999:999 /var/lib/docker/BASE/volumes/redis_data
sudo chown -R 999:999 /var/lib/docker/BASE/volumes/rabbitmq_data
sudo chown -R 1000:1000 /var/lib/docker/BASE/volumes/uploads_data
sudo chmod -R 755 /var/lib/docker/BASE/volumes/

# Subir containers
echo "Subindo containers..."
docker compose -f docker-compose.prod.yml up -d

echo "Restauração concluída!"
```

## ⏰ Agendamento de Backups

### Cron Jobs

```bash
# Editar crontab
sudo crontab -e

# Backup diário às 2h da manhã
0 2 * * * /opt/BASE/scripts/backup.sh >> /var/log/backup.log 2>&1

# Backup semanal aos domingos às 3h
0 3 * * 0 /opt/BASE/scripts/backup.sh --full >> /var/log/backup.log 2>&1

# Limpeza mensal no primeiro dia do mês às 4h
0 4 1 * * find /var/backups/BASE -name "*.tar.gz" -mtime +90 -delete
```

### Verificação de Backups

```bash
#!/bin/bash
# scripts/verify-backup.sh

BACKUP_DIR="/var/backups/BASE"
LATEST_BACKUP=$(ls -t $BACKUP_DIR/volumes_*.tar.gz | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "ERRO: Nenhum backup encontrado!"
    exit 1
fi

echo "Verificando backup: $LATEST_BACKUP"

# Verificar integridade
if tar -tzf $LATEST_BACKUP > /dev/null 2>&1; then
    echo "✅ Backup íntegro"
else
    echo "❌ Backup corrompido!"
    exit 1
fi

# Verificar tamanho
SIZE=$(du -h $LATEST_BACKUP | cut -f1)
echo "📊 Tamanho: $SIZE"

# Verificar data
DATE=$(stat -c %y $LATEST_BACKUP)
echo "📅 Data: $DATE"
```

## 🚨 Disaster Recovery

### Cenários de Recuperação

#### 1. Falha Total do Servidor

```bash
# 1. Provisionar novo servidor
curl -O https://raw.githubusercontent.com/AluizioNunes/BASE/main/scripts/setup-new-server.sh
chmod +x setup-new-server.sh
sudo ./setup-new-server.sh

# 2. Clonar repositório
git clone https://github.com/AluizioNunes/BASE.git
cd BASE

# 3. Restaurar backup mais recente
./scripts/restore.sh volumes_20241201_120000.tar.gz

# 4. Verificar funcionamento
docker compose -f docker-compose.prod.yml ps
```

#### 2. Corrupção de Banco de Dados

```bash
# 1. Parar aplicação
docker compose -f docker-compose.prod.yml stop backend

# 2. Restaurar apenas postgres_data
tar -xzf backup_volumes.tar.gz -C /var/lib/docker/BASE/volumes/postgres_data

# 3. Aplicar permissões
sudo chown -R 999:999 /var/lib/docker/BASE/volumes/postgres_data

# 4. Reiniciar aplicação
docker compose -f docker-compose.prod.yml up -d
```

#### 3. Perda de Arquivos de Upload

```bash
# 1. Restaurar apenas uploads_data
tar -xzf backup_volumes.tar.gz -C /var/lib/docker/BASE/volumes/uploads_data

# 2. Aplicar permissões
sudo chown -R 1000:1000 /var/lib/docker/BASE/volumes/uploads_data

# 3. Verificar integridade
docker exec -it [backend_container] ls -la /app/uploads/
```

### Procedimento de Recuperação

#### Checklist de Recuperação

- [ ] **Identificar o problema**
  - [ ] Verificar logs: `docker compose logs [serviço]`
  - [ ] Verificar status: `docker compose ps`
  - [ ] Verificar recursos: `df -h`, `free -h`

- [ ] **Escolher estratégia de recuperação**
  - [ ] Recuperação completa (novo servidor)
  - [ ] Recuperação parcial (serviço específico)
  - [ ] Recuperação de dados (volume específico)

- [ ] **Executar recuperação**
  - [ ] Parar serviços afetados
  - [ ] Restaurar dados do backup
  - [ ] Aplicar permissões corretas
  - [ ] Reiniciar serviços

- [ ] **Verificar funcionamento**
  - [ ] Testar endpoints críticos
  - [ ] Verificar logs de erro
  - [ ] Confirmar integridade dos dados
  - [ ] Notificar stakeholders

## 📊 Monitoramento de Backups

### Métricas de Backup

```bash
#!/bin/bash
# scripts/backup-metrics.sh

BACKUP_DIR="/var/backups/BASE"

# Estatísticas de backup
echo "=== ESTATÍSTICAS DE BACKUP ==="
echo "Total de backups: $(ls $BACKUP_DIR/volumes_*.tar.gz | wc -l)"
echo "Tamanho total: $(du -sh $BACKUP_DIR | cut -f1)"
echo "Backup mais recente: $(ls -t $BACKUP_DIR/volumes_*.tar.gz | head -1)"
echo "Idade do backup mais recente: $(find $BACKUP_DIR -name "volumes_*.tar.gz" -printf '%AY-%Am-%Ad %AH:%AM\n' | head -1)"

# Verificar integridade
echo -e "\n=== VERIFICAÇÃO DE INTEGRIDADE ==="
for backup in $BACKUP_DIR/volumes_*.tar.gz; do
    if tar -tzf "$backup" > /dev/null 2>&1; then
        echo "✅ $(basename $backup) - OK"
    else
        echo "❌ $(basename $backup) - CORROMPIDO"
    fi
done
```

### Alertas de Backup

```bash
#!/bin/bash
# scripts/backup-alerts.sh

# Verificar se backup foi feito nas últimas 24h
LAST_BACKUP=$(find /var/backups/BASE -name "volumes_*.tar.gz" -mtime -1)

if [ -z "$LAST_BACKUP" ]; then
    echo "🚨 ALERTA: Backup não realizado nas últimas 24h!"
    # Enviar notificação (email, Slack, etc.)
    exit 1
fi

# Verificar tamanho do backup
SIZE=$(du -m /var/backups/BASE/volumes_*.tar.gz | tail -1 | cut -f1)
if [ $SIZE -lt 100 ]; then
    echo "⚠️  AVISO: Backup muito pequeno ($SIZE MB)"
fi

echo "✅ Backup OK"
```

## 🔒 Segurança de Backups

### Criptografia

```bash
# Backup criptografado
gpg --encrypt --recipient admin@empresa.com \
    --output $BACKUP_DIR/volumes_$DATE.tar.gz.gpg \
    $BACKUP_DIR/volumes_$DATE.tar.gz

# Restaurar backup criptografado
gpg --decrypt $BACKUP_DIR/volumes_$DATE.tar.gz.gpg | \
    tar -xz -C /var/lib/docker/BASE/
```

### Backup Remoto

```bash
# Sincronizar com servidor remoto
rsync -avz --delete \
    /var/backups/BASE/ \
    user@backup-server:/backups/BASE/

# Backup para cloud (exemplo com AWS S3)
aws s3 sync /var/backups/BASE/ s3://bucket-backup/BASE/
```

## 📋 Política de Retenção

### Estratégia de Retenção

| Tipo | Frequência | Retenção | Local |
|------|------------|----------|-------|
| **Backup Diário** | 1x/dia | 30 dias | Local |
| **Backup Semanal** | 1x/semana | 12 semanas | Local + Remoto |
| **Backup Mensal** | 1x/mês | 12 meses | Local + Remoto + Cloud |
| **Backup Anual** | 1x/ano | 7 anos | Cloud |

### Limpeza Automática

```bash
#!/bin/bash
# scripts/cleanup-backups.sh

BACKUP_DIR="/var/backups/BASE"

# Limpar backups diários antigos (>30 dias)
find $BACKUP_DIR -name "volumes_*.tar.gz" -mtime +30 -delete

# Limpar backups semanais antigos (>12 semanas)
find $BACKUP_DIR -name "volumes_weekly_*.tar.gz" -mtime +84 -delete

# Limpar backups mensais antigos (>12 meses)
find $BACKUP_DIR -name "volumes_monthly_*.tar.gz" -mtime +365 -delete

echo "Limpeza de backups concluída"
```

## 🧪 Teste de Recuperação

### Procedimento de Teste

```bash
#!/bin/bash
# scripts/test-recovery.sh

echo "🧪 Iniciando teste de recuperação..."

# 1. Criar ambiente de teste
mkdir -p /tmp/recovery-test
cd /tmp/recovery-test

# 2. Restaurar backup em ambiente isolado
tar -xzf /var/backups/BASE/volumes_$(date +%Y%m%d).tar.gz

# 3. Verificar integridade dos dados
echo "Verificando integridade..."
find . -type f -exec file {} \; | grep -v "text\|empty"

# 4. Testar conectividade de banco
echo "Testando banco de dados..."
# (comandos específicos para testar PostgreSQL)

# 5. Limpar ambiente de teste
rm -rf /tmp/recovery-test

echo "✅ Teste de recuperação concluído"
```

### Agendamento de Testes

```bash
# Teste mensal de recuperação
0 5 1 * * /opt/BASE/scripts/test-recovery.sh >> /var/log/recovery-test.log 2>&1
```

## 📚 Documentação de Recuperação

### Procedimentos por Cenário

1. **Falha de Hardware**
   - Recuperação completa em novo servidor
   - Tempo estimado: 2-4 horas

2. **Corrupção de Dados**
   - Restauração seletiva de volumes
   - Tempo estimado: 30-60 minutos

3. **Ataque de Ransomware**
   - Restauração de backup limpo
   - Tempo estimado: 1-2 horas

4. **Erro de Configuração**
   - Rollback para versão anterior
   - Tempo estimado: 15-30 minutos

---

**BASE - Sistema de Gestão** - Estratégia robusta de backup para máxima segurança dos dados. 