#!/bin/bash

echo "🔍 Verificando status do Traefik..."
echo "=================================="

# Verificar se o container está rodando
echo "1. Status do container Traefik:"
docker compose -f docker-compose.prod.yml ps traefik

echo -e "\n2. Logs do Traefik (últimas 20 linhas):"
docker compose -f docker-compose.prod.yml logs --tail=20 traefik

echo -e "\n3. Verificar se a porta 8080 está ouvindo:"
netstat -tlnp | grep :8080 || echo "Porta 8080 não está ouvindo"

echo -e "\n4. Testar acesso direto ao Traefik:"
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/http/routers || echo "Erro ao acessar API do Traefik"

echo -e "\n5. Verificar configuração do Traefik:"
docker compose -f docker-compose.prod.yml exec traefik traefik version 2>/dev/null || echo "Não foi possível executar comando no container"

echo -e "\n6. Verificar se o volume do Traefik existe:"
ls -la /var/lib/docker/BASE/volumes/traefik_data/ 2>/dev/null || echo "Volume não encontrado"

echo -e "\n7. Testar acesso HTTPS:"
curl -k -s -o /dev/null -w "%{http_code}" https://10.10.255.111/traefik/ || echo "Erro ao acessar via HTTPS"

echo -e "\n✅ Diagnóstico concluído!" 