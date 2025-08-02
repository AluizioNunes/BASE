#!/usr/bin/env python3
"""
Script para verificar se a tabela Usuarios existe
"""

import psycopg

# Configurações de conexão - SERVIDOR REMOTO
DB_CONFIG = {
    'host': '10.10.255.111',
    'port': 5432,
    'dbname': 'BASE',
    'user': 'BASE',
    'password': 'BASE'
}

try:
    with psycopg.connect(**DB_CONFIG) as conn:
        with conn.cursor() as cursor:
            
            # Verifica se a tabela existe
            cursor.execute("""
                SELECT COUNT(*) FROM information_schema.tables 
                WHERE table_name = 'Usuarios'
            """)
            
            count = cursor.fetchone()[0]
            print(f"Tabelas Usuarios encontradas: {count}")
            
            if count > 0:
                # Verifica estrutura
                cursor.execute("""
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = 'Usuarios' 
                    ORDER BY ordinal_position
                """)
                
                columns = cursor.fetchall()
                print("\nColunas na tabela Usuarios:")
                for col in columns:
                    print(f"  - {col[0]}: {col[1]}")
                
                # Verifica dados
                cursor.execute("SELECT COUNT(*) FROM \"Usuarios\"")
                user_count = cursor.fetchone()[0]
                print(f"\nTotal de usuários: {user_count}")
                
                # Lista usuários
                cursor.execute("SELECT \"Nome\", \"Email\", \"Usuario\" FROM \"Usuarios\"")
                users = cursor.fetchall()
                print("\nUsuários:")
                for user in users:
                    print(f"  - {user[0]} ({user[1]}) - {user[2]}")
            else:
                print("❌ Tabela Usuarios não encontrada!")
                
except Exception as e:
    print(f"❌ Erro: {e}") 