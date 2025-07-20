#!/bin/bash

# Script para criar diretórios de volumes padronizados
echo "📁 Criando diretórios de volumes padronizados..."

# Diretório base
BASE_VOLUMES_DIR="/var/lib/docker/BASE/volumes"

# Criar diretório base se não existir
sudo mkdir -p "$BASE_VOLUMES_DIR"

# Lista de volumes necessários
volumes=(
    "pgsql_data"
    "redis_data"
    "rabbitmq_data"
    "grafana_data"
    "loki_data"
    "traefik_data"
    "portainer_data"
    "uploads_data"
)

# Criar cada diretório de volume
for volume in "${volumes[@]}"; do
    volume_path="$BASE_VOLUMES_DIR/$volume"
    echo "📂 Criando: $volume_path"
    sudo mkdir -p "$volume_path"
    
    # Definir permissões adequadas
    sudo chown -R 1000:1000 "$volume_path" 2>/dev/null || true
    sudo chmod -R 755 "$volume_path"
done

# Verificar se os diretórios foram criados
echo ""
echo "✅ Diretórios criados:"
ls -la "$BASE_VOLUMES_DIR"

echo ""
echo "📊 Espaço em disco:"
df -h "$BASE_VOLUMES_DIR"

echo ""
echo "🎉 Volumes padronizados criados com sucesso!"
echo "📍 Localização: $BASE_VOLUMES_DIR" 