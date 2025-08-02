#!/usr/bin/env python3
"""
Script simples para testar conexão com o banco de dados
"""

import os
import sys
from dotenv import load_dotenv

# Adicionar o diretório pai ao path para importar módulos
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def main():
    print("=== TESTE DE CONEXÃO COM BANCO DE DADOS ===\n")
    
    # Carregar variáveis de ambiente
    load_dotenv()
    
    # Mostrar variáveis de banco
    print("Variáveis de ambiente:")
    print(f"DB_HOST: {os.getenv('DB_HOST', 'NÃO DEFINIDO')}")
    print(f"DB_PORT: {os.getenv('DB_PORT', 'NÃO DEFINIDO')}")
    print(f"DB_NAME: {os.getenv('DB_NAME', 'NÃO DEFINIDO')}")
    print(f"DB_USER: {os.getenv('DB_USER', 'NÃO DEFINIDO')}")
    print(f"DB_PASSWORD: {'*' * 8 if os.getenv('DB_PASSWORD') else 'NÃO DEFINIDO'}")
    print(f"DB_SCHEMA: {os.getenv('DB_SCHEMA', 'NÃO DEFINIDO')}")
    
    # Construir DATABASE_URL
    # Se estiver executando fora do Docker, usar localhost
    db_host = os.getenv('DB_HOST', 'localhost')
    if db_host == 'db':  # Nome do container Docker
        db_host = 'localhost'  # Para testes locais
    
    db_port = os.getenv('DB_PORT', '5432')
    db_name = os.getenv('DB_NAME', 'BASE')
    db_user = os.getenv('DB_USER', 'BASE')
    db_password = os.getenv('DB_PASSWORD', 'BASE123')
    
    database_url = f"postgresql+psycopg://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    print(f"\nDATABASE_URL: {database_url}")
    
    # Testar conexão
    try:
        from sqlalchemy import create_engine, text
        
        print("\n🔍 Testando conexão...")
        engine = create_engine(database_url)
        
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ Conexão bem-sucedida!")
            print(f"   PostgreSQL: {version}")
            
            # Testar se a tabela existe
            result = conn.execute(text("""
                SELECT COUNT(*) 
                FROM information_schema.tables 
                WHERE table_schema = 'BASE' 
                AND table_name = 'Usuarios'
            """))
            count = result.fetchone()[0]
            
            if count > 0:
                print("✅ Tabela 'BASE.Usuarios' encontrada!")
                
                # Contar usuários
                result = conn.execute(text('SELECT COUNT(*) FROM "BASE"."Usuarios"'))
                user_count = result.fetchone()[0]
                print(f"   Total de usuários: {user_count}")
            else:
                print("❌ Tabela 'BASE.Usuarios' NÃO encontrada!")
                
    except Exception as e:
        print(f"❌ Erro na conexão: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 