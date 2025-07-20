#!/bin/bash

# Script para configurar Portainer
echo "🚀 Configurando Portainer..."

# Criar diretório para volumes se não existir
sudo mkdir -p /var/lib/docker/BASE/volumes/portainer

# Parar e remover container existente se houver
docker-compose -f docker-compose.portainer.yml down

# Iniciar Portainer
docker-compose -f docker-compose.portainer.yml up -d

# Aguardar inicialização
echo "⏳ Aguardando Portainer inicializar..."
sleep 10

# Verificar status
if docker-compose -f docker-compose.portainer.yml ps | grep -q "Up"; then
    echo "✅ Portainer iniciado com sucesso!"
    echo "🌐 Acesse: http://localhost:9000"
    echo "📝 Primeira vez: Crie um usuário admin"
    echo "🔧 Conecte ao Docker Socket local"
else
    echo "❌ Erro ao iniciar Portainer"
    docker-compose -f docker-compose.portainer.yml logs
fi 