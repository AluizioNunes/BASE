#!/bin/bash

echo "🔍 Verificando status de todos os serviços..."
echo "============================================="

# Verificar se o docker-compose está rodando
echo "1. Status de todos os containers:"
docker compose -f docker-compose.prod.yml ps

echo -e "\n2. Containers que não estão rodando:"
docker compose -f docker-compose.prod.yml ps | grep -v "Up"

echo -e "\n3. Logs do Traefik (últimas 10 linhas):"
docker compose -f docker-compose.prod.yml logs --tail=10 traefik

echo -e "\n4. Logs do Grafana (últimas 10 linhas):"
docker compose -f docker-compose.prod.yml logs --tail=10 grafana

echo -e "\n5. Logs do Loki (últimas 10 linhas):"
docker compose -f docker-compose.prod.yml logs --tail=10 loki

echo -e "\n6. Verificar portas em uso:"
netstat -tlnp | grep -E ":80|:443|:8080|:3001|:3101"

echo -e "\n7. Testar conectividade HTTP:"
echo "Traefik HTTP:"
curl -s -o /dev/null -w "%{http_code}" http://localhost/traefik/ || echo "Erro"
echo "Grafana HTTP:"
curl -s -o /dev/null -w "%{http_code}" http://localhost/grafana/ || echo "Erro"
echo "Loki HTTP:"
curl -s -o /dev/null -w "%{http_code}" http://localhost/loki/ || echo "Erro"

echo -e "\n8. Verificar volumes:"
ls -la /var/lib/docker/BASE/volumes/ 2>/dev/null || echo "Volume não encontrado"

echo -e "\n9. Verificar permissões dos volumes:"
ls -la /var/lib/docker/BASE/volumes/grafana_data/ 2>/dev/null || echo "Volume Grafana não encontrado"
ls -la /var/lib/docker/BASE/volumes/loki_data/ 2>/dev/null || echo "Volume Loki não encontrado"

echo -e "\n✅ Diagnóstico concluído!" 