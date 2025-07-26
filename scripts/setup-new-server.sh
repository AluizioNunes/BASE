#!/bin/bash

# Script de Setup para Novo Servidor
# Instala todas as dependências necessárias

set -e

echo "🖥️  Configurando novo servidor para deploy..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Atualizar sistema
log_info "Atualizando sistema..."
sudo apt update && sudo apt upgrade -y
log_success "Sistema atualizado"

# 2. Instalar dependências básicas
log_info "Instalando dependências básicas..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
log_success "Dependências básicas instaladas"

# 3. Instalar Docker
log_info "Instalando Docker..."
if ! command -v docker &> /dev/null; then
    # Adicionar repositório oficial do Docker
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    sudo usermod -aG docker $USER
    
    log_success "Docker instalado"
    log_warning "Reinicie o sistema ou faça logout/login para aplicar as permissões do Docker"
else
    log_success "Docker já está instalado"
fi

# 4. Instalar Docker Compose (se não estiver instalado)
log_info "Verificando Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    log_success "Docker Compose instalado"
else
    log_success "Docker Compose já está instalado"
fi

# 5. Instalar Portainer (opcional)
read -p "Deseja instalar o Portainer? (y/n): " install_portainer
if [[ $install_portainer =~ ^[Yy]$ ]]; then
    log_info "Instalando Portainer..."
    docker volume create portainer_data
    docker run -d -p 8000:8000 -p 9443:9443 --name=portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:latest
    log_success "Portainer instalado em https://$(hostname -I | awk '{print $1}'):9443"
fi

# 6. Configurar firewall básico
log_info "Configurando firewall..."
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8000/tcp
sudo ufw allow 9443/tcp
sudo ufw --force enable
log_success "Firewall configurado"

# 7. Criar diretório para a aplicação
log_info "Criando estrutura de diretórios..."
sudo mkdir -p /var/lib/docker/BASE/volumes/{grafana_data,loki_data,postgres_data,redis_data,rabbitmq_data,uploads_data}
log_success "Diretórios criados"

# 8. Definir permissões iniciais
log_info "Definindo permissões iniciais..."
sudo chown -R 472:472 /var/lib/docker/BASE/volumes/grafana_data
sudo chown -R 1000:1000 /var/lib/docker/BASE/volumes/loki_data
sudo chown -R 999:999 /var/lib/docker/BASE/volumes/postgres_data
sudo chown -R 999:999 /var/lib/docker/BASE/volumes/redis_data
sudo chown -R 999:999 /var/lib/docker/BASE/volumes/rabbitmq_data
sudo chown -R 1000:1000 /var/lib/docker/BASE/volumes/uploads_data
sudo chmod -R 755 /var/lib/docker/BASE/volumes/
log_success "Permissões definidas"

# 9. Configurar swap (se necessário)
log_info "Verificando memória e swap..."
TOTAL_MEM=$(free -m | awk 'NR==2{printf "%.0f", $2}')
if [ $TOTAL_MEM -lt 2048 ]; then
    log_warning "Memória baixa detectada (${TOTAL_MEM}MB). Configurando swap..."
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    log_success "Swap configurado"
else
    log_success "Memória suficiente (${TOTAL_MEM}MB)"
fi

# 10. Configurar limpeza automática do Docker
log_info "Configurando limpeza automática do Docker..."
sudo tee /etc/cron.daily/docker-cleanup << 'EOF'
#!/bin/bash
docker system prune -f
docker volume prune -f
EOF
sudo chmod +x /etc/cron.daily/docker-cleanup
log_success "Limpeza automática configurada"

# 11. Resumo final
echo ""
echo "=========================================="
echo "        SETUP DO SERVIDOR CONCLUÍDO"
echo "=========================================="
log_success "✅ Servidor configurado com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Clone o repositório: git clone https://github.com/AluizioNunes/BASE.git"
echo "2. Entre no diretório: cd BASE"
echo "3. Execute o deploy: ./scripts/deploy-production.sh"
echo ""
echo "🌐 URLs disponíveis:"
if [[ $install_portainer =~ ^[Yy]$ ]]; then
    echo "   Portainer: https://$(hostname -I | awk '{print $1}'):9443"
fi
echo "   SSH: ssh root@$(hostname -I | awk '{print $1}')"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Reinicie o sistema ou faça logout/login para aplicar as permissões do Docker"
echo "   - Configure backups dos volumes em /var/lib/docker/BASE/volumes/"
echo "   - Monitore os logs regularmente"
echo "==========================================" 