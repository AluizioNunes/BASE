#!/bin/bash

# Script Wrapper para Deploy de Produção
# Executa preparativos antes de subir containers

set -e

echo "🚀 Iniciando deploy de produção com verificações automáticas..."

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

# Função para verificar se Docker está rodando
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker não está rodando!"
        exit 1
    fi
}

# Função para preparar volumes e permissões
prepare_volumes() {
    log_info "Preparando volumes e permissões..."
    
    # Criar diretórios se não existirem
    sudo mkdir -p /var/lib/docker/BASE/volumes/{grafana_data,loki_data,postgres_data,redis_data,rabbitmq_data,uploads_data,traefik_data}
    
    # Definir permissões corretas
    sudo chown -R 472:472 /var/lib/docker/BASE/volumes/grafana_data
    sudo chown -R 1000:1000 /var/lib/docker/BASE/volumes/loki_data
    sudo chown -R 999:999 /var/lib/docker/BASE/volumes/postgres_data
    sudo chown -R 999:999 /var/lib/docker/BASE/volumes/redis_data
    sudo chown -R 999:999 /var/lib/docker/BASE/volumes/rabbitmq_data
    sudo chown -R 1000:1000 /var/lib/docker/BASE/volumes/uploads_data
    sudo chmod -R 755 /var/lib/docker/BASE/volumes/
    
    log_success "Volumes preparados"
}

# Função para verificar portas
check_ports() {
    log_info "Verificando portas..."
    
    local ports=(80 443 8080)
    local conflicts=()
    
    for port in "${ports[@]}"; do
        if ss -tlnp | grep ":$port " > /dev/null; then
            conflicts+=($port)
        fi
    done
    
    if [ ${#conflicts[@]} -gt 0 ]; then
        log_warning "Portas em conflito detectadas: ${conflicts[*]}"
        log_info "Tentando liberar portas..."
        
        # Parar containers que possam estar usando as portas
        docker ps --format "{{.Names}}" | grep -E "(traefik|nginx|apache)" | xargs -r docker stop || true
        sleep 3
        
        # Verificar novamente
        for port in "${conflicts[@]}"; do
            if ss -tlnp | grep ":$port " > /dev/null; then
                log_error "Porta $port ainda está em uso. Pare o serviço manualmente."
                exit 1
            fi
        done
    fi
    
    log_success "Portas verificadas"
}

# Função para verificar arquivos necessários
check_files() {
    log_info "Verificando arquivos necessários..."
    
    local required_files=(
        "docker-compose.prod.yml"
        "Dockerfile"
        "Backend/Dockerfile"
        "package.json"
        "Backend/requirements.txt"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            log_error "Arquivo necessário não encontrado: $file"
            exit 1
        fi
    done
    
    log_success "Arquivos verificados"
}

# Função para verificar espaço em disco
check_disk_space() {
    log_info "Verificando espaço em disco..."
    
    local available_space=$(df / | awk 'NR==2 {print $4}')
    local required_space=5242880  # 5GB em KB
    
    if [ "$available_space" -lt "$required_space" ]; then
        log_error "Espaço insuficiente em disco. Necessário: 5GB, Disponível: $((available_space / 1024 / 1024))GB"
        exit 1
    fi
    
    log_success "Espaço em disco OK"
}

# Função para verificar memória
check_memory() {
    log_info "Verificando memória..."
    
    local total_mem=$(free -m | awk 'NR==2{printf "%.0f", $2}')
    local required_mem=2048  # 2GB
    
    if [ "$total_mem" -lt "$required_mem" ]; then
        log_warning "Memória baixa: ${total_mem}MB (recomendado: ${required_mem}MB)"
    else
        log_success "Memória OK: ${total_mem}MB"
    fi
}

# Função principal
main() {
    echo "=========================================="
    echo "    VERIFICAÇÕES PRÉ-DEPLOY"
    echo "=========================================="
    
    check_docker
    check_files
    check_disk_space
    check_memory
    check_ports
    prepare_volumes
    
    echo ""
    echo "=========================================="
    echo "    INICIANDO CONTAINERS"
    echo "=========================================="
    
    # Subir containers
    log_info "Subindo containers..."
    docker compose -f docker-compose.prod.yml up -d --build
    
    # Aguardar inicialização
    log_info "Aguardando inicialização..."
    sleep 30
    
    # Verificar status
    log_info "Verificando status dos containers..."
    if docker compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        log_success "✅ Deploy concluído com sucesso!"
        
        echo ""
        echo "🌐 URLs de acesso:"
        echo "   Frontend: https://$(hostname -I | awk '{print $1}')/"
        echo "   Backend:  https://$(hostname -I | awk '{print $1}')/api/"
        echo "   Grafana:  https://$(hostname -I | awk '{print $1}')/grafana/"
        echo "   Loki:     https://$(hostname -I | awk '{print $1}')/loki/"
        echo "   Traefik:  https://$(hostname -I | awk '{print $1}')/traefik/"
        
        echo ""
        echo "📊 Status dos containers:"
        docker compose -f docker-compose.prod.yml ps
    else
        log_error "❌ Alguns containers não estão rodando!"
        docker compose -f docker-compose.prod.yml ps
        exit 1
    fi
    
    echo "=========================================="
}

# Executar função principal
main "$@" 