#!/bin/bash

# Script para executar atualizações de autenticação dentro do container Docker
echo "🔧 Executando atualizações de autenticação no Docker..."

# Verifica se o container backend está rodando
if ! docker ps | grep -q "backend"; then
    echo "❌ Container backend não está rodando. Iniciando..."
    cd /c/BASE
    docker-compose -f docker-compose.prod.yml up -d backend
    sleep 10
fi

# Executa o script Python dentro do container
echo "📝 Executando script de atualização..."
docker exec -it backend python /app/scripts/executar_atualizacao_auth.py

# Verifica se foi bem-sucedido
if [ $? -eq 0 ]; then
    echo "✅ Atualizações aplicadas com sucesso!"
    echo ""
    echo "🔑 Credenciais de acesso:"
    echo "   Email: base@itfact.com.br"
    echo "   Usuário: ADMIN"
    echo "   Senha: ADMIN"
    echo ""
    echo "🚀 Próximos passos:"
    echo "  1. Acesse http://10.10.255.111"
    echo "  2. Faça login com as credenciais acima"
    echo "  3. Configure MFA se necessário"
else
    echo "❌ Erro ao aplicar atualizações"
    exit 1
fi 