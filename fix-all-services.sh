#!/bin/bash

echo "🚀 Recriando todos os serviços..."
echo "=================================="

# 1. Parar tudo
echo "1. Parando todos os containers..."
docker compose -f docker-compose.prod.yml down

# 2. Remover containers órfãos
echo "2. Removendo containers órfãos..."
docker container prune -f

# 3. Limpar volumes problemáticos
echo "3. Limpando volumes..."
sudo rm -rf /var/lib/docker/BASE/volumes/grafana_data/*
sudo rm -rf /var/lib/docker/BASE/volumes/loki_data/*
sudo rm -rf /var/lib/docker/BASE/volumes/traefik_data/*

# 4. Recriar diretórios com permissões corretas
echo "4. Recriando diretórios com permissões..."
sudo mkdir -p /var/lib/docker/BASE/volumes/{grafana_data,loki_data,postgres_data,redis_data,rabbitmq_data,uploads_data,traefik_data}
sudo chown -R 472:472 /var/lib/docker/BASE/volumes/grafana_data
sudo chown -R 1000:1000 /var/lib/docker/BASE/volumes/loki_data
sudo chown -R 999:999 /var/lib/docker/BASE/volumes/{postgres_data,redis_data,rabbitmq_data}
sudo chown -R 1000:1000 /var/lib/docker/BASE/volumes/uploads_data
sudo chmod -R 755 /var/lib/docker/BASE/volumes/

# 5. Subir apenas serviços essenciais primeiro
echo "5. Subindo Traefik primeiro..."
docker compose -f docker-compose.prod.yml up -d traefik

# 6. Aguardar Traefik inicializar
echo "6. Aguardando Traefik inicializar..."
sleep 10

# 7. Subir Grafana e Loki
echo "7. Subindo Grafana e Loki..."
docker compose -f docker-compose.prod.yml up -d grafana loki

# 8. Aguardar inicialização
echo "8. Aguardando inicialização..."
sleep 15

# 9. Verificar status
echo "9. Verificando status..."
docker compose -f docker-compose.prod.yml ps

# 10. Testar conectividade
echo "10. Testando conectividade..."
echo "Traefik:"
curl -s -o /dev/null -w "%{http_code}" http://localhost/traefik/ || echo "Erro"
echo "Grafana:"
curl -s -o /dev/null -w "%{http_code}" http://localhost/grafana/ || echo "Erro"
echo "Loki:"
curl -s -o /dev/null -w "%{http_code}" http://localhost/loki/ || echo "Erro"

echo "✅ Recriação concluída!" 