#!/usr/bin/env python3
"""
Script para verificar se as variáveis de ambiente estão sendo carregadas corretamente
"""

import os
from dotenv import load_dotenv

def main():
    print("=== VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE ===\n")
    
    # Tentar carregar o .env
    env_path = os.path.join(os.path.dirname(__file__), '../.env')
    if os.path.exists(env_path):
        print(f"✅ Arquivo .env encontrado em: {env_path}")
        load_dotenv(env_path)
    else:
        print(f"❌ Arquivo .env NÃO encontrado em: {env_path}")
        print("   Tentando carregar do diretório atual...")
        load_dotenv()
    
    # Variáveis importantes para verificar
    vars_to_check = [
        'APP_NAME',
        'SERVER_IP', 
        'DB_HOST',
        'DB_PORT',
        'DB_NAME',
        'DB_USER',
        'DB_PASSWORD',
        'DB_SCHEMA',
        'REDIS_PASSWORD',
        'RABBITMQ_USER',
        'RABBITMQ_PASSWORD',
        'GRAFANA_USER',
        'GRAFANA_PASSWORD',
        'VITE_API_URL',
        'BACKEND_CORS_ORIGINS'
    ]
    
    print("\n=== VALORES DAS VARIÁVEIS ===\n")
    
    for var in vars_to_check:
        value = os.getenv(var)
        if value:
            # Mascarar senhas
            if 'PASSWORD' in var or 'SECRET' in var:
                masked_value = '*' * min(len(value), 8)
                print(f"✅ {var}: {masked_value}")
            else:
                print(f"✅ {var}: {value}")
        else:
            print(f"❌ {var}: NÃO DEFINIDA")
    
    print("\n=== CONSTRUÇÃO DA DATABASE_URL ===\n")
    
    # Construir DATABASE_URL
    db_host = os.getenv('DB_HOST', 'localhost')
    db_port = os.getenv('DB_PORT', '5432')
    db_name = os.getenv('DB_NAME', 'BASE')
    db_user = os.getenv('DB_USER', 'BASE')
    db_password = os.getenv('DB_PASSWORD', 'BASE123')
    db_schema = os.getenv('DB_SCHEMA', 'BASE')
    
    database_url = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    print(f"Database URL: {database_url}")
    print(f"Schema: {db_schema}")
    
    print("\n=== VERIFICAÇÃO CONCLUÍDA ===")

if __name__ == "__main__":
    main() 