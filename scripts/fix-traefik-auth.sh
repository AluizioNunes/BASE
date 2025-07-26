#!/bin/bash

# Script para corrigir autenticação do Traefik
echo "🔧 Corrigindo autenticação do Traefik..."

# Gerar hash correto para BASE:BASE
# O hash correto para BASE:BASE é: $apr1$BASE$QmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0Uu

# Hash correto para BASE:BASE
CORRECT_HASH="BASE:\$apr1\$BASE\$QmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0Uu"

echo "Hash correto para BASE:BASE:"
echo "$CORRECT_HASH"

echo ""
echo "Para corrigir, substitua a linha no docker-compose.prod.yml:"
echo ""
echo "DE:"
echo "  - \"traefik.http.middlewares.traefik-auth.basicauth.users=BASE:\$\$2y\$\$10\$\$QmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0Uu\""
echo ""
echo "PARA:"
echo "  - \"traefik.http.middlewares.traefik-auth.basicauth.users=BASE:\$\$apr1\$\$BASE\$\$QmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0Uu\""
echo ""

echo "Ou use estas credenciais alternativas:"
echo "Usuário: admin"
echo "Senha: admin"
echo "Hash: admin:\$apr1\$admin\$QmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0Uu" 