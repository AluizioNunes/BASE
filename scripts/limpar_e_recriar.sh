#!/bin/bash

echo "🧹 LIMPANDO E RECRIANDO CONTAINERS BASE"
echo "========================================"

# Parar e remover todos os containers
echo "📦 Parando containers..."
docker-compose -f docker-compose.prod.yml down

# Remover volumes do PostgreSQL para forçar recriação da database
echo "🗄️ Removendo volume do PostgreSQL..."
sudo rm -rf /var/lib/docker/BASE/volumes/Backend/pgsql_data

# Remover outros volumes se necessário
echo "🗑️ Removendo outros volumes..."
sudo rm -rf /var/lib/docker/BASE/volumes/grafana_data
sudo rm -rf /var/lib/docker/BASE/volumes/redis_data
sudo rm -rf /var/lib/docker/BASE/volumes/rabbitmq_data
sudo rm -rf /var/lib/docker/BASE/volumes/loki_data

# Recriar diretórios
echo "📁 Recriando diretórios..."
sudo mkdir -p /var/lib/docker/BASE/volumes/Backend/pgsql_data
sudo mkdir -p /var/lib/docker/BASE/volumes/grafana_data
sudo mkdir -p /var/lib/docker/BASE/volumes/redis_data
sudo mkdir -p /var/lib/docker/BASE/volumes/rabbitmq_data
sudo mkdir -p /var/lib/docker/BASE/volumes/loki_data

# Definir permissões
echo "🔐 Definindo permissões..."
sudo chown -R 999:999 /var/lib/docker/BASE/volumes/Backend/pgsql_data
sudo chown -R 472:472 /var/lib/docker/BASE/volumes/grafana_data
sudo chown -R 1000:1000 /var/lib/docker/BASE/volumes/loki_data

# Reconstruir e subir containers
echo "🚀 Reconstruindo e subindo containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# Aguardar PostgreSQL inicializar
echo "⏳ Aguardando PostgreSQL inicializar..."
sleep 30

# Verificar status dos containers
echo "📊 Status dos containers:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "✅ PROCESSO CONCLUÍDO!"
echo "🌐 Acesse: http://10.10.255.111"
echo "📊 Grafana: http://10.10.255.111/grafana"
echo "🔧 Traefik: http://10.10.255.111/traefik"
echo "🐰 RabbitMQ: http://10.10.255.111/rabbitmq"
echo "📈 Loki: http://10.10.255.111/loki"
echo ""
echo "🔑 Credenciais:"
echo "   - Usuário: ADMIN ou base@itfact.com.br"
echo "   - Senha: ADMIN123"
echo "   - Grafana: BASE/BASE"
echo "   - RabbitMQ: BASE/BASE" 