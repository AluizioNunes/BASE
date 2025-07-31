#!/bin/bash

# Script para configurar o Chatwoot seguindo a documentação oficial
echo "Configurando Chatwoot..."

# Aguardar o banco de dados estar pronto
echo "Aguardando banco de dados..."
sleep 30

# Verificar se o banco CHATWOOT já existe
echo "Verificando banco de dados..."
docker exec base-db-1 psql -U BASE -d BASE -c "SELECT 1 FROM pg_database WHERE datname='CHATWOOT';" | grep -q 1

if [ $? -eq 0 ]; then
    echo "Banco CHATWOOT já existe, pulando criação..."
else
    echo "Criando banco CHATWOOT..."
    docker exec base-db-1 createdb -U BASE CHATWOOT
fi

# Executar comando oficial do Chatwoot para preparar o banco
echo "Executando chatwoot_prepare..."
docker exec base-chatwoot-1 bundle exec rails db:chatwoot_prepare

echo "Chatwoot configurado com sucesso!" 