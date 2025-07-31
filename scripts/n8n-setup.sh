#!/bin/bash

# Script para verificar e configurar o n8n
echo "Verificando n8n..."

# Aguardar o container inicializar
echo "Aguardando n8n inicializar..."
sleep 30

# Verificar se o container está rodando
if docker ps | grep -q "base-n8n-1"; then
    echo "Container n8n está rodando"
    
    # Verificar logs
    echo "Logs do n8n:"
    docker logs base-n8n-1 --tail 20
    
    # Verificar se a porta está respondendo
    echo "Testando conectividade na porta 5678..."
    if curl -s http://localhost:5678 > /dev/null; then
        echo "n8n está respondendo na porta 5678"
    else
        echo "n8n não está respondendo na porta 5678"
    fi
else
    echo "Container n8n não está rodando"
    docker ps -a | grep n8n
fi

echo "Verificação concluída!" 