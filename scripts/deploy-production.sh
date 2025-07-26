#!/bin/bash

# Script de Deploy Automatizado para Produção
# Resolve automaticamente problemas de permissão, portas e dependências

set -e  # Para execução em caso de erro

echo "🚀 Iniciando deploy automatizado para produção..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
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

# 1. Verificar se Docker está instalado
log_info "Verificando Docker..."
if ! command -v docker &> /dev/null; then
    log_error "Docker não está instalado!"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose não está instalado!"
    exit 1
fi

log_success "Docker e Docker Compose encontrados"

# 2. Parar containers existentes (se houver)
log_info "Parando containers existentes..."
docker compose -f docker-compose.prod.yml down 2>/dev/null || true
log_success "Containers parados"

# 3. Verificar e liberar portas
log_info "Verificando portas em uso..."
PORTS_TO_CHECK=(80 443 8080)
for port in "${PORTS_TO_CHECK[@]}"; do
    if ss -tlnp | grep ":$port " > /dev/null; then
        log_warning "Porta $port está em uso. Tentando liberar..."
        # Tenta parar containers que possam estar usando a porta
        docker ps --format "{{.Names}}" | grep -E "(traefik|nginx|apache)" | xargs -r docker stop || true
        sleep 2
    fi
done
log_success "Portas verificadas"

# 4. Limpar volumes existentes
log_info "Limpando volumes existentes..."
sudo rm -rf /var/lib/docker/BASE/volumes/* 2>/dev/null || true
log_success "Volumes limpos"

# 5. Criar estrutura de diretórios
log_info "Criando estrutura de diretórios..."
sudo mkdir -p /var/lib/docker/BASE/volumes/{grafana_data,loki_data,postgres_data,redis_data,rabbitmq_data,uploads_data}
log_success "Diretórios criados"

# 6. Definir permissões corretas
log_info "Definindo permissões..."
sudo chown -R 472:472 /var/lib/docker/BASE/volumes/grafana_data
sudo chown -R 1000:1000 /var/lib/docker/BASE/volumes/loki_data
sudo chown -R 999:999 /var/lib/docker/BASE/volumes/postgres_data
sudo chown -R 999:999 /var/lib/docker/BASE/volumes/redis_data
sudo chown -R 999:999 /var/lib/docker/BASE/volumes/rabbitmq_data
sudo chown -R 1000:1000 /var/lib/docker/BASE/volumes/uploads_data
sudo chmod -R 755 /var/lib/docker/BASE/volumes/
log_success "Permissões definidas"

# 7. Verificar se o arquivo docker-compose.prod.yml existe
if [ ! -f "docker-compose.prod.yml" ]; then
    log_error "Arquivo docker-compose.prod.yml não encontrado!"
    exit 1
fi

# 8. Fazer pull das imagens mais recentes
log_info "Baixando imagens mais recentes..."
docker compose -f docker-compose.prod.yml pull 2>/dev/null || true
log_success "Imagens atualizadas"

# 9. Subir containers
log_info "Subindo containers..."
docker compose -f docker-compose.prod.yml up -d --build
log_success "Containers iniciados"

# 10. Aguardar inicialização
log_info "Aguardando inicialização dos serviços..."
sleep 30

# 11. Verificar status dos containers
log_info "Verificando status dos containers..."
if docker compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    log_success "Todos os containers estão rodando!"
else
    log_error "Alguns containers não estão rodando!"
    docker compose -f docker-compose.prod.yml ps
    exit 1
fi

# 12. Verificar logs de erro
log_info "Verificando logs por erros..."
ERRORS=0

# Verificar Grafana
if docker logs $(docker compose -f docker-compose.prod.yml ps -q grafana) 2>&1 | grep -q "Permission denied"; then
    log_error "Grafana ainda tem problemas de permissão!"
    ERRORS=$((ERRORS + 1))
fi

# Verificar Loki
if docker logs $(docker compose -f docker-compose.prod.yml ps -q loki) 2>&1 | grep -q "Permission denied"; then
    log_error "Loki ainda tem problemas de permissão!"
    ERRORS=$((ERRORS + 1))
fi

# Verificar Backend
if docker logs $(docker compose -f docker-compose.prod.yml ps -q backend) 2>&1 | grep -q "error"; then
    log_warning "Backend pode ter erros (verificar logs)"
fi

# Verificar Frontend
if docker logs $(docker compose -f docker-compose.prod.yml ps -q frontend) 2>&1 | grep -q "error"; then
    log_warning "Frontend pode ter erros (verificar logs)"
fi

# 13. Teste de conectividade
log_info "Testando conectividade..."
if curl -s -k -o /dev/null -w '%{http_code}' https://localhost/ | grep -q "200"; then
    log_success "Frontend acessível via HTTPS"
else
    log_warning "Frontend pode não estar acessível"
fi

# 14. Resumo final
echo ""
echo "=========================================="
echo "           RESUMO DO DEPLOY"
echo "=========================================="

if [ $ERRORS -eq 0 ]; then
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
    log_error "❌ Deploy concluído com $ERRORS erro(s)"
    echo ""
    echo "🔍 Verifique os logs:"
    echo "   docker compose -f docker-compose.prod.yml logs [serviço]"
fi

echo "==========================================" 