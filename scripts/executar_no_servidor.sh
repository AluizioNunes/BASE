#!/bin/bash

echo "🚀 EXECUTANDO NO SERVIDOR REMOTO (10.10.255.111)"
echo "================================================"

# Verificar se estamos no diretório correto
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Erro: docker-compose.prod.yml não encontrado!"
    echo "💡 Certifique-se de estar no diretório BASE no servidor"
    exit 1
fi

# 1. Parar containers
echo "📦 Parando containers..."
docker-compose -f docker-compose.prod.yml down

# 2. Remover volumes
echo "🗄️ Removendo volumes..."
sudo rm -rf /var/lib/docker/BASE/volumes/Backend/pgsql_data
sudo rm -rf /var/lib/docker/BASE/volumes/grafana_data
sudo rm -rf /var/lib/docker/BASE/volumes/redis_data
sudo rm -rf /var/lib/docker/BASE/volumes/rabbitmq_data
sudo rm -rf /var/lib/docker/BASE/volumes/loki_data

# 3. Recriar diretórios
echo "📁 Recriando diretórios..."
sudo mkdir -p /var/lib/docker/BASE/volumes/Backend/pgsql_data
sudo mkdir -p /var/lib/docker/BASE/volumes/grafana_data
sudo mkdir -p /var/lib/docker/BASE/volumes/redis_data
sudo mkdir -p /var/lib/docker/BASE/volumes/rabbitmq_data
sudo mkdir -p /var/lib/docker/BASE/volumes/loki_data

# 4. Definir permissões
echo "🔐 Definindo permissões..."
sudo chown -R 999:999 /var/lib/docker/BASE/volumes/Backend/pgsql_data
sudo chown -R 472:472 /var/lib/docker/BASE/volumes/grafana_data
sudo chown -R 1000:1000 /var/lib/docker/BASE/volumes/loki_data

# 5. Reconstruir e subir containers
echo "🚀 Reconstruindo e subindo containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# 6. Aguardar inicialização
echo "⏳ Aguardando serviços inicializarem..."
sleep 45

# 7. Verificar status
echo "📊 Status dos containers:"
docker-compose -f docker-compose.prod.yml ps

# 8. Testar conectividade
echo ""
echo "🧪 Testando conectividade..."
echo "Frontend: http://10.10.255.111"
echo "Grafana: http://10.10.255.111/grafana"
echo "Traefik: http://10.10.255.111/traefik"
echo "RabbitMQ: http://10.10.255.111/rabbitmq"

echo ""
echo "✅ PROCESSO CONCLUÍDO!"
echo "🔑 Credenciais:"
echo "   - Frontend: ADMIN/ADMIN123 ou base@itfact.com.br/ADMIN123"
echo "   - Grafana: BASE/BASE"
echo "   - RabbitMQ: BASE/BASE" 