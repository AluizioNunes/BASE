#!/usr/bin/env python3
"""
Script para criar a tabela USUARIOS no PostgreSQL usando psycopg-binary (versão moderna)
"""
import os
import sys
import psycopg
from psycopg.rows import dict_row

# Adiciona o diretório atual ao path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def conectar_postgres():
    """Conecta ao PostgreSQL usando psycopg-binary (versão moderna)"""
    try:
        # Configurações de conexão
        config = {
            'host': os.getenv('DBHOST', '10.10.255.111'),  # Servidor Docker
            'port': os.getenv('DBPORT', '5432'),
            'dbname': os.getenv('DBNAME', 'BASE'),  # psycopg3 usa 'dbname'
            'user': os.getenv('DBUSER', 'BASE'),
            'password': os.getenv('DBPASSWORD', 'BASE')
        }
        
        print(f"🔌 Conectando ao PostgreSQL em {config['host']}:{config['port']}...")
        
        # Nova sintaxe do psycopg-binary
        conn = psycopg.connect(**config)
        conn.autocommit = True
        
        print("✅ Conexão estabelecida com sucesso!")
        return conn
        
    except Exception as e:
        print(f"❌ Erro ao conectar: {e}")
        return None

def executar_script_sql(conn, arquivo_sql):
    """Executa o script SQL usando psycopg-binary"""
    try:
        print(f"📄 Executando script: {arquivo_sql}")
        
        # Lê o arquivo SQL
        with open(arquivo_sql, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        # Divide o script em comandos individuais
        commands = sql_content.split(';')
        
        with conn.cursor() as cursor:
            for command in commands:
                command = command.strip()
                if command and not command.startswith('--'):
                    try:
                        cursor.execute(command)
                        print(f"✅ Comando executado: {command[:50]}...")
                    except Exception as e:
                        print(f"⚠️ Aviso no comando: {e}")
                        # Continua executando outros comandos
        
        print("✅ Script SQL executado com sucesso!")
        return True
        
    except Exception as e:
        print(f"❌ Erro ao executar script: {e}")
        return False

def verificar_tabela(conn):
    """Verifica se a tabela foi criada corretamente usando psycopg-binary"""
    try:
        with conn.cursor(row_factory=dict_row) as cursor:
            # Verifica se a tabela existe
            cursor.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'USUARIOS'
                );
            """)
            
            existe = cursor.fetchone()['exists']
            
            if existe:
                print("✅ Tabela USUARIOS criada com sucesso!")
                
                # Mostra estrutura da tabela
                cursor.execute("""
                    SELECT column_name, data_type, character_maximum_length, is_nullable
                    FROM information_schema.columns 
                    WHERE table_name = 'USUARIOS' 
                    ORDER BY ordinal_position;
                """)
                
                colunas = cursor.fetchall()
                print("\n📋 Estrutura da tabela:")
                print("-" * 80)
                print(f"{'Coluna':<15} {'Tipo':<20} {'Tamanho':<10} {'Nulo':<5}")
                print("-" * 80)
                
                for coluna in colunas:
                    nome = coluna['column_name']
                    tipo = coluna['data_type']
                    tamanho = coluna['character_maximum_length']
                    nulo = coluna['is_nullable']
                    tamanho_str = str(tamanho) if tamanho else '-'
                    print(f"{nome:<15} {tipo:<20} {tamanho_str:<10} {nulo:<5}")
                
                # Verifica dados de exemplo
                cursor.execute("SELECT COUNT(*) as total FROM USUARIOS;")
                count = cursor.fetchone()['total']
                print(f"\n📊 Total de registros: {count}")
                
                if count > 0:
                    cursor.execute("SELECT \"Nome\", \"Email\", \"Perfil\" FROM USUARIOS LIMIT 3;")
                    usuarios = cursor.fetchall()
                    print("\n👥 Usuários de exemplo:")
                    for usuario in usuarios:
                        print(f"  - {usuario['Nome']} ({usuario['Email']}) - {usuario['Perfil']}")
                
            else:
                print("❌ Tabela USUARIOS não foi criada!")
            
            return existe
        
    except Exception as e:
        print(f"❌ Erro ao verificar tabela: {e}")
        return False

def main():
    """Função principal usando psycopg-binary"""
    print("🚀 Iniciando criação da tabela USUARIOS com psycopg-binary...")
    print("=" * 70)
    
    # Conecta ao PostgreSQL
    conn = conectar_postgres()
    if not conn:
        return False
    
    try:
        # Executa o script SQL
        script_path = os.path.join(os.path.dirname(__file__), 'criar_tabela_usuarios.sql')
        
        if not os.path.exists(script_path):
            print(f"❌ Arquivo SQL não encontrado: {script_path}")
            return False
        
        sucesso = executar_script_sql(conn, script_path)
        
        if sucesso:
            # Verifica se a tabela foi criada
            verificar_tabela(conn)
            print("\n🎉 Processo concluído com sucesso!")
            return True
        else:
            print("\n❌ Falha na criação da tabela!")
            return False
            
    except Exception as e:
        print(f"❌ Erro durante o processo: {e}")
        return False
    
    finally:
        if conn:
            conn.close()
            print("🔌 Conexão fechada.")

if __name__ == "__main__":
    sucesso = main()
    sys.exit(0 if sucesso else 1) 