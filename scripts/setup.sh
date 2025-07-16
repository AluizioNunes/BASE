#!/bin/bash
# Instala dependências do backend e frontend
echo "Instalando dependências do backend..."
cd ../backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt
cd ../
echo "Instalando dependências do frontend..."
npm install
echo "Setup concluído!" 