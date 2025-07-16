#!/bin/bash
# Exemplo de script de deploy
# Adapte conforme sua infraestrutura

echo "Buildando frontend..."
npm run build

echo "Buildando backend..."
cd ../backend && source venv/bin/activate && echo "Backend pronto para deploy"

echo "Deploy concluído!" 