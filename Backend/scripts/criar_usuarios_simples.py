#!/usr/bin/env python3
"""
Script simples para criar tabela USUARIOS
"""
import psycopg
import os

def main():
    """Função principal"""
    print("🚀 Criando tabela USUARIOS...")
    
    # Configuração de conexão
    config = {
        'host': '10.10.255.111',
        'port': 5432,
        'dbname': 'BASE',
        'user': 'BASE',
        'password': 'BASE',
        'autocommit': True
    }
    
    try:
        # Conecta ao PostgreSQL
        print("🔌 Conectando ao PostgreSQL...")
        conn = psycopg.connect(**config)
        print("✅ Conexão estabelecida!")
        
        # Lê o arquivo SQL
        script_path = os.path.join(os.path.dirname(__file__), 'criar_tabela_usuarios_simples.sql')
        print(f"📄 Lendo script: {script_path}")
        
        with open(script_path, 'r', encoding='utf-8') as file:
            sql_script = file.read()
        
        # Executa o script
        print("⚡ Executando script SQL...")
        with conn.cursor() as cursor:
            cursor.execute(sql_script)
        
        # Verifica se a tabela foi criada
        print("🔍 Verificando se a tabela foi criada...")
        with conn.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM USUARIOS;")
            count = cursor.fetchone()[0]
            print(f"✅ Tabela USUARIOS criada com {count} registros!")
            
            # Lista as colunas
            cursor.execute("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'USUARIOS' 
                ORDER BY ordinal_position;
            """)
            columns = cursor.fetchall()
            print("📋 Colunas da tabela:")
            for col in columns:
                print(f"   - {col[0]}: {col[1]}")
        
        conn.close()
        print("🎉 Tabela USUARIOS criada com sucesso!")
        return True
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

if __name__ == "__main__":
    sucesso = main()
    exit(0 if sucesso else 1) 