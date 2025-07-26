#!/bin/bash

# Script Demonstrativo: Diferentes Formas de Usar Hooks de Inicialização
# Mostra como garantir que verificações rodem antes dos containers

set -e

echo "🔧 Demonstração: Hooks de Inicialização no Docker Compose"
echo ""

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

echo "=========================================="
echo "    OPÇÕES DE HOOKS DE INICIALIZAÇÃO"
echo "=========================================="
echo ""

echo "1️⃣  OPÇÃO 1: Script Wrapper (Recomendado)"
echo "   ✅ Mais flexível e controlado"
echo "   ✅ Pode fazer verificações complexas"
echo "   ✅ Logs detalhados"
echo "   ❌ Requer script externo"
echo ""
echo "   Uso: ./scripts/start-production.sh"
echo ""

echo "2️⃣  OPÇÃO 2: Init Containers (Docker Compose)"
echo "   ✅ Integrado ao Docker Compose"
echo "   ✅ Dependências automáticas"
echo "   ✅ Roda apenas uma vez"
echo "   ❌ Menos flexível"
echo ""
echo "   Uso: docker compose -f docker-compose.prod-with-init.yml up -d"
echo ""

echo "3️⃣  OPÇÃO 3: Profiles (Docker Compose Extensions)"
echo "   ✅ Mais moderno"
echo "   ✅ Reutilizável"
echo "   ✅ Limpo e organizado"
echo "   ❌ Requer Docker Compose v2.4+"
echo ""
echo "   Uso: docker compose --profile init -f docker-compose.prod-extensions.yml up -d"
echo ""

echo "=========================================="
echo "    EXEMPLOS DE USO"
echo "=========================================="
echo ""

# Função para demonstrar Opção 1
demo_option1() {
    log_info "Demonstrando Opção 1: Script Wrapper"
    echo "   Este script executa verificações ANTES de subir containers:"
    echo "   - Verifica Docker"
    echo "   - Verifica arquivos necessários"
    echo "   - Verifica espaço em disco"
    echo "   - Verifica memória"
    echo "   - Verifica portas"
    echo "   - Prepara volumes e permissões"
    echo "   - Só então sobe os containers"
    echo ""
}

# Função para demonstrar Opção 2
demo_option2() {
    log_info "Demonstrando Opção 2: Init Containers"
    echo "   O docker-compose.prod-with-init.yml contém:"
    echo "   - init-volumes: prepara volumes"
    echo "   - check-ports: verifica portas"
    echo "   - Todos os outros containers dependem desses"
    echo "   - Containers só sobem após init containers terminarem"
    echo ""
}

# Função para demonstrar Opção 3
demo_option3() {
    log_info "Demonstrando Opção 3: Profiles"
    echo "   O docker-compose.prod-extensions.yml usa:"
    echo "   - Profile 'init' para verificações"
    echo "   - pre-init: container de inicialização"
    echo "   - Uso: --profile init para ativar verificações"
    echo "   - Uso: sem profile para deploy normal"
    echo ""
}

# Executar demonstrações
demo_option1
demo_option2
demo_option3

echo "=========================================="
echo "    QUAL OPÇÃO ESCOLHER?"
echo "=========================================="
echo ""

echo "🎯 PARA PRODUÇÃO:"
echo "   Recomendo a OPÇÃO 1 (Script Wrapper)"
echo "   - Mais controle e visibilidade"
echo "   - Fácil de debugar"
echo "   - Pode incluir verificações customizadas"
echo ""

echo "🎯 PARA DESENVOLVIMENTO:"
echo "   Recomendo a OPÇÃO 3 (Profiles)"
echo "   - Mais limpo"
echo "   - Integrado ao Docker Compose"
echo "   - Fácil de ativar/desativar"
echo ""

echo "🎯 PARA SIMPLICIDADE:"
echo "   Use a OPÇÃO 2 (Init Containers)"
echo "   - Sempre roda automaticamente"
echo "   - Não precisa lembrar de comandos especiais"
echo ""

echo "=========================================="
echo "    COMANDOS PRÁTICOS"
echo "=========================================="
echo ""

echo "🚀 Deploy com verificações (Opção 1):"
echo "   chmod +x scripts/start-production.sh"
echo "   sudo ./scripts/start-production.sh"
echo ""

echo "🚀 Deploy com init containers (Opção 2):"
echo "   docker compose -f docker-compose.prod-with-init.yml up -d"
echo ""

echo "🚀 Deploy com profiles (Opção 3):"
echo "   docker compose --profile init -f docker-compose.prod-extensions.yml up -d"
echo ""

echo "🚀 Deploy normal (sem verificações):"
echo "   docker compose -f docker-compose.prod.yml up -d"
echo ""

echo "=========================================="
echo "    VANTAGENS DOS HOOKS"
echo "=========================================="
echo ""

echo "✅ PREVENÇÃO DE PROBLEMAS:"
echo "   - Detecta problemas ANTES de subir containers"
echo "   - Evita falhas durante o deploy"
echo "   - Reduz tempo de troubleshooting"
echo ""

echo "✅ CONFIABILIDADE:"
echo "   - Deploy sempre consistente"
echo "   - Permissões sempre corretas"
echo "   - Portas sempre verificadas"
echo ""

echo "✅ AUTOMAÇÃO:"
echo "   - Sem intervenção manual"
echo "   - Funciona em qualquer servidor"
echo "   - Documentação viva"
echo ""

echo "==========================================" 