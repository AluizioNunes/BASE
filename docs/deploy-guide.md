# 🚀 Guia de Deploy para Produção

Este guia te ajudará a fazer deploy da aplicação BASE em qualquer servidor Linux, evitando todos os problemas comuns.

## 📋 Pré-requisitos

- Servidor Linux (Ubuntu 20.04+ recomendado)
- Acesso root ou sudo
- Conexão com internet
- Mínimo 2GB RAM (4GB+ recomendado)

## 🛠️ Setup Inicial do Servidor

### Opção 1: Script Automatizado (Recomendado)

```bash
# 1. Baixe o script de setup
curl -O https://raw.githubusercontent.com/AluizioNunes/BASE/main/scripts/setup-new-server.sh

# 2. Torne executável
chmod +x setup-new-server.sh

# 3. Execute como root
sudo ./setup-new-server.sh
```

### Opção 2: Manual

```bash
# 1. Atualizar sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 3. Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Reiniciar sistema (importante!)
sudo reboot
```

## 📦 Deploy da Aplicação

### 1. Clonar o Repositório

```bash
git clone https://github.com/AluizioNunes/BASE.git
cd BASE
git checkout develop  # ou master
```

### 2. Deploy com Hooks de Inicialização (Recomendado)

#### Opção A: Script Wrapper Completo
```bash
# Torne o script executável
chmod +x scripts/start-production.sh

# Execute o deploy com verificações automáticas
sudo ./scripts/start-production.sh
```

**O que este script faz:**
- ✅ Verifica se Docker está rodando
- ✅ Verifica arquivos necessários
- ✅ Verifica espaço em disco (mínimo 5GB)
- ✅ Verifica memória (mínimo 2GB)
- ✅ Verifica e libera portas 80/443/8080
- ✅ Prepara volumes com permissões corretas
- ✅ Sobe containers com build
- ✅ Aguarda inicialização
- ✅ Verifica status e conectividade
- ✅ Fornece relatório completo

#### Opção B: Init Containers (Docker Compose)
```bash
# Deploy com containers de inicialização
docker compose -f docker-compose.prod-with-init.yml up -d
```

**O que acontece:**
- `init-volumes`: prepara volumes e permissões
- `check-ports`: verifica portas
- Todos os outros containers dependem desses
- Containers só sobem após init containers terminarem

#### Opção C: Profiles (Docker Compose Extensions)
```bash
# Deploy com verificações opcionais
docker compose --profile init -f docker-compose.prod-extensions.yml up -d

# Deploy normal (sem verificações)
docker compose -f docker-compose.prod-extensions.yml up -d
```

### 3. Deploy Manual (Apenas se necessário)

```bash
# 1. Parar containers existentes
docker compose -f docker-compose.prod.yml down

# 2. Limpar volumes (CUIDADO: perde dados!)
sudo rm -rf /var/lib/docker/BASE/volumes/*

# 3. Criar diretórios
sudo mkdir -p /var/lib/docker/BASE/volumes/{grafana_data,loki_data,postgres_data,redis_data,rabbitmq_data,uploads_data,traefik_data}

# 4. Definir permissões
sudo chown -R 472:472 /var/lib/docker/BASE/volumes/grafana_data
sudo chown -R 1000:1000 /var/lib/docker/BASE/volumes/loki_data
sudo chown -R 999:999 /var/lib/docker/BASE/volumes/postgres_data
sudo chown -R 999:999 /var/lib/docker/BASE/volumes/redis_data
sudo chown -R 999:999 /var/lib/docker/BASE/volumes/rabbitmq_data
sudo chown -R 1000:1000 /var/lib/docker/BASE/volumes/uploads_data
sudo chmod -R 755 /var/lib/docker/BASE/volumes/

# 5. Subir containers
docker compose -f docker-compose.prod.yml up -d --build
```

## 🌐 URLs de Acesso

Após o deploy bem-sucedido, você terá acesso a:

- **Frontend**: `https://SEU_IP/`
- **Backend API**: `https://SEU_IP/api/`
- **Grafana**: `https://SEU_IP/grafana/` (admin/BASE)
- **Loki**: `https://SEU_IP/loki/`
- **Traefik Dashboard**: `https://SEU_IP/traefik/`
- **Portainer**: `http://SEU_IP:8000/`

## 🔧 Comandos Úteis

### Verificar Status
```bash
# Status dos containers
docker compose -f docker-compose.prod.yml ps

# Logs de um serviço específico
docker compose -f docker-compose.prod.yml logs [serviço]

# Logs em tempo real
docker compose -f docker-compose.prod.yml logs -f [serviço]
```

### Manutenção
```bash
# Parar todos os serviços
docker compose -f docker-compose.prod.yml down

# Reiniciar um serviço específico
docker compose -f docker-compose.prod.yml restart [serviço]

# Rebuild de um serviço
docker compose -f docker-compose.prod.yml up -d --build [serviço]
```

### Backup
```bash
# Backup dos volumes
sudo tar -czf backup-$(date +%Y%m%d).tar.gz /var/lib/docker/BASE/volumes/

# Restaurar backup
sudo tar -xzf backup-20241201.tar.gz -C /
```

## 🚨 Troubleshooting

### Problema: Containers não iniciam
```bash
# Verificar logs
docker compose -f docker-compose.prod.yml logs

# Verificar espaço em disco
df -h

# Verificar memória
free -h
```

### Problema: Erros de permissão
```bash
# Reaplicar permissões
sudo chown -R 472:472 /var/lib/docker/BASE/volumes/grafana_data
sudo chown -R 1000:1000 /var/lib/docker/BASE/volumes/loki_data
sudo chown -R 999:999 /var/lib/docker/BASE/volumes/{postgres_data,redis_data,rabbitmq_data}
sudo chmod -R 755 /var/lib/docker/BASE/volumes/
```

### Problema: Porta 80/443 em uso
```bash
# Verificar o que está usando a porta
sudo ss -tlnp | grep :80
sudo ss -tlnp | grep :443

# Parar serviços conflitantes
sudo systemctl stop nginx apache2 2>/dev/null || true
```

### Problema: SSL/HTTPS não funciona
```bash
# Verificar certificados do Traefik
docker logs 6-traefik-1 | grep -i cert

# Verificar configuração do Traefik
curl -s http://localhost:8080/api/http/routers
```

## 📊 Monitoramento

### Logs Centralizados
- **Grafana**: `https://SEU_IP/grafana/` (admin/admin)
- **Loki**: `https://SEU_IP/loki/`

### Métricas do Sistema
```bash
# Uso de CPU e memória
htop

# Uso de disco
df -h

# Logs do sistema
sudo journalctl -f
```

## 🔒 Segurança

### Firewall
```bash
# Configurar UFW
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8000/tcp
sudo ufw --force enable
```

### Atualizações
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Atualizar containers
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

## 📝 Checklist de Deploy

- [ ] Servidor configurado com Docker
- [ ] Repositório clonado
- [ ] Scripts de deploy executados
- [ ] Volumes criados com permissões corretas
- [ ] Containers rodando sem erros
- [ ] Frontend acessível via HTTPS
- [ ] Backend respondendo
- [ ] Grafana e Loki funcionando
- [ ] Firewall configurado
- [ ] Backup configurado
- [ ] Monitoramento ativo

## 🔧 Scripts Disponíveis

### Scripts Principais
- `scripts/start-production.sh` - **Deploy completo com verificações**
- `scripts/setup-new-server.sh` - **Setup inicial de servidor**
- `scripts/deploy-production.sh` - **Deploy automatizado**
- `scripts/deploy-with-hooks.sh` - **Demonstração de hooks**

### Arquivos Docker Compose
- `docker-compose.prod.yml` - **Deploy normal**
- `docker-compose.prod-with-init.yml` - **Com init containers**
- `docker-compose.prod-extensions.yml` - **Com profiles**

## 🎯 Recomendações por Cenário

### 🏭 Produção (Recomendado)
```bash
# Use o script wrapper completo
sudo ./scripts/start-production.sh
```

### 🧪 Desenvolvimento
```bash
# Use profiles para flexibilidade
docker compose --profile init -f docker-compose.prod-extensions.yml up -d
```

### 🚀 Simplicidade
```bash
# Use init containers para automação total
docker compose -f docker-compose.prod-with-init.yml up -d
```

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs: `docker compose -f docker-compose.prod.yml logs`
2. Consulte este guia
3. Execute o script de troubleshooting: `./scripts/deploy-with-hooks.sh`
4. Abra uma issue no GitHub
5. Verifique a documentação do Traefik, Grafana e Loki

---

**Lembre-se**: Sempre faça backup antes de atualizações importantes! 