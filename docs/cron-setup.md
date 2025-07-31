# Configuração de Cron Job para Backup Automático

## Visão Geral

Este documento explica como configurar um cron job para executar backups automáticos do sistema BASE.

## Pré-requisitos

- Acesso root no servidor
- Docker e Docker Compose instalados
- Sistema Linux com cron instalado

## Instalação Automática

### 1. Executar Script de Configuração

```bash
# Baixar o script
wget https://raw.githubusercontent.com/seu-repo/BASE/main/scripts/setup-cron-backup.sh

# Tornar executável
chmod +x setup-cron-backup.sh

# Executar como root
sudo ./setup-cron-backup.sh
```

### 2. Verificar Instalação

```bash
# Verificar cron jobs ativos
sudo crontab -l

# Verificar logs
tail -f /var/log/BASE/backup.log

# Verificar backups
ls -la /var/backups/BASE/
```

## Configuração Manual

### 1. Instalar Cron (se necessário)

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install cron

# CentOS/RHEL
sudo yum install cronie
sudo systemctl enable crond
sudo systemctl start crond

# Fedora
sudo dnf install cronie
sudo systemctl enable crond
sudo systemctl start crond
```

### 2. Configurar Cron Job

```bash
# Editar cron jobs do root
sudo crontab -e

# Adicionar as seguintes linhas:
# Backup diário às 2h da manhã
0 2 * * * /opt/BASE/scripts/backup-automated.sh >> /var/log/BASE/backup.log 2>&1

# Limpeza de logs antigos às 3h
0 3 * * * find /var/log/BASE -name '*.log' -mtime +30 -delete

# Verificação de espaço em disco às 4h
0 4 * * * df -h /var/backups/BASE | awk 'NR==2 {if($5+0>80) system("echo '\''ALERTA: Disco com mais de 80% de uso'\'' | mail -s '\''Alerta de Disco'\'' admin@base.com")}'

# Monitoramento às 6h
0 6 * * * /opt/BASE/scripts/monitor-cron.sh
```

## Agendamentos Disponíveis

### Backup Diário (Recomendado)
```bash
0 2 * * *  # Todos os dias às 2h da manhã
```

### Backup Semanal
```bash
0 2 * * 0  # Todos os domingos às 2h da manhã
```

### Backup Mensal
```bash
0 2 1 * *  # Primeiro dia do mês às 2h da manhã
```

### Backup Personalizado
```bash
# A cada 6 horas
0 */6 * * *

# A cada 12 horas
0 */12 * * *

# Em horários específicos
0 2,14 * * *  # 2h e 14h todos os dias
```

## Monitoramento

### 1. Verificar Status do Cron

```bash
# Verificar se o serviço está rodando
sudo systemctl status cron

# Verificar cron jobs ativos
sudo crontab -l

# Verificar logs do sistema
sudo journalctl -u cron
```

### 2. Verificar Logs de Backup

```bash
# Ver logs em tempo real
tail -f /var/log/BASE/backup.log

# Ver últimos 100 linhas
tail -n 100 /var/log/BASE/backup.log

# Buscar por erros
grep "ERRO" /var/log/BASE/backup.log

# Buscar por sucessos
grep "SUCESSO" /var/log/BASE/backup.log
```

### 3. Verificar Backups

```bash
# Listar backups
ls -la /var/backups/BASE/

# Verificar tamanho dos backups
du -sh /var/backups/BASE/*

# Verificar integridade (checksum)
sha256sum -c /var/backups/BASE/BASE_backup_*.tar.gz.sha256
```

## Alertas e Notificações

### 1. Configurar Email

```bash
# Instalar mailutils
sudo apt-get install mailutils

# Configurar postfix
sudo dpkg-reconfigure postfix

# Testar envio de email
echo "Teste de email" | mail -s "Teste" seu-email@exemplo.com
```

### 2. Configurar Slack/Webhook

Edite o script `backup-automated.sh` e descomente a seção de notificação:

```bash
# Notificação via webhook
curl -X POST -H "Content-Type: application/json" \
     -d "{\"text\":\"Backup BASE concluído: $BACKUP_NAME ($BACKUP_SIZE)\"}" \
     "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
```

## Troubleshooting

### Problema: Cron não executa

```bash
# Verificar se o cron está rodando
sudo systemctl status cron

# Verificar permissões do script
ls -la /opt/BASE/scripts/backup-automated.sh

# Verificar logs do cron
sudo journalctl -u cron -f
```

### Problema: Script falha

```bash
# Executar manualmente para debug
sudo /opt/BASE/scripts/backup-automated.sh

# Verificar dependências
sudo docker ps
sudo docker compose -f /opt/BASE/docker-compose.prod.yml ps
```

### Problema: Sem espaço em disco

```bash
# Verificar espaço disponível
df -h

# Limpar backups antigos
find /var/backups/BASE -name "BASE_backup_*.tar.gz" -mtime +30 -delete

# Limpar logs antigos
find /var/log/BASE -name "*.log" -mtime +30 -delete
```

### Problema: Permissões negadas

```bash
# Corrigir permissões
sudo chown -R root:root /var/backups/BASE
sudo chown -R root:root /var/log/BASE
sudo chmod -R 755 /var/backups/BASE
sudo chmod -R 755 /var/log/BASE
sudo chmod +x /opt/BASE/scripts/backup-automated.sh
```

## Manutenção

### 1. Rotação de Backups

O sistema mantém automaticamente:
- **30 dias** de backups diários
- **Logs** por 30 dias
- **Alertas** quando disco > 80%

### 2. Limpeza Manual

```bash
# Limpar backups antigos
sudo find /var/backups/BASE -name "BASE_backup_*.tar.gz" -mtime +30 -delete

# Limpar logs antigos
sudo find /var/log/BASE -name "*.log" -mtime +30 -delete

# Limpar checksums antigos
sudo find /var/backups/BASE -name "*.sha256" -mtime +30 -delete
```

### 3. Backup de Configuração

```bash
# Fazer backup da configuração do cron
sudo crontab -l > /var/backups/BASE/cron-backup.txt

# Restaurar configuração do cron
sudo crontab /var/backups/BASE/cron-backup.txt
```

## Segurança

### Boas Práticas

1. **Execute como root** para ter acesso aos volumes Docker
2. **Monitore os logs** regularmente
3. **Teste restaurações** periodicamente
4. **Mantenha backups** em localização segura
5. **Configure alertas** para falhas

### Permissões

```bash
# Configurar permissões adequadas
sudo chown root:root /opt/BASE/scripts/backup-automated.sh
sudo chmod 700 /opt/BASE/scripts/backup-automated.sh
sudo chmod 600 /var/log/BASE/backup.log
```

## Recuperação

### 1. Restaurar Backup

```bash
# Parar containers
sudo docker compose -f /opt/BASE/docker-compose.prod.yml down

# Restaurar volumes
sudo tar -xzf /var/backups/BASE/BASE_backup_YYYYMMDD_HHMMSS.tar.gz -C /var/lib/docker/BASE/volumes/

# Reiniciar containers
sudo docker compose -f /opt/BASE/docker-compose.prod.yml up -d
```

### 2. Verificar Integridade

```bash
# Verificar checksum
sha256sum -c /var/backups/BASE/BASE_backup_YYYYMMDD_HHMMSS.tar.gz.sha256

# Verificar conteúdo
tar -tzf /var/backups/BASE/BASE_backup_YYYYMMDD_HHMMSS.tar.gz | head -20
``` 