#!/usr/bin/env python3
"""
Script para testar conectividade com o servidor PostgreSQL
"""
import socket
import time
import psycopg

def testar_conectividade_rede():
    """Testa se consegue conectar na porta 5432 do servidor"""
    print("🔍 Testando conectividade de rede...")
    
    try:
        # Testa conexão TCP na porta 5432
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(10)  # 10 segundos de timeout
        
        print("📡 Tentando conectar em 10.10.255.111:5432...")
        start_time = time.time()
        result = sock.connect_ex(('10.10.255.111', 5432))
        connection_time = time.time() - start_time
        sock.close()
        
        print(f"⏱️ Tempo de tentativa: {connection_time:.2f} segundos")
        
        if result == 0:
            print("✅ Porta 5432 está acessível!")
            return True
        else:
            print(f"❌ Porta 5432 não está acessível (erro: {result})")
            return False
            
    except Exception as e:
        print(f"❌ Erro ao testar conectividade: {e}")
        return False

def testar_conexao_postgres():
    """Testa conexão com PostgreSQL"""
    print("\n🐘 Testando conexão com PostgreSQL...")
    
    try:
        # Configuração de conexão
        config = {
            'host': '10.10.255.111',
            'port': 5432,
            'dbname': 'BASE',
            'user': 'BASE',
            'password': 'BASE',
            'connect_timeout': 15  # 15 segundos de timeout
        }
        
        print("🔌 Tentando conectar...")
        start_time = time.time()
        
        conn = psycopg.connect(**config)
        connection_time = time.time() - start_time
        
        print(f"✅ Conexão estabelecida em {connection_time:.2f} segundos!")
        
        # Testa query simples
        with conn.cursor() as cursor:
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"✅ PostgreSQL versão: {version[0]}")
            
            # Verifica se o banco BASE existe
            cursor.execute("SELECT current_database();")
            db_name = cursor.fetchone()
            print(f"✅ Banco atual: {db_name[0]}")
            
            # Lista as tabelas existentes
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """)
            tables = cursor.fetchall()
            print(f"✅ Tabelas existentes: {len(tables)}")
            for table in tables:
                print(f"   - {table[0]}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Erro na conexão PostgreSQL: {e}")
        return False

def testar_conexao_postgres_alternativa():
    """Testa conexão com PostgreSQL usando usuário postgres padrão"""
    print("\n🐘 Testando conexão alternativa com usuário postgres...")
    
    try:
        # Configuração de conexão alternativa
        config = {
            'host': '10.10.255.111',
            'port': 5432,
            'dbname': 'postgres',  # Banco padrão
            'user': 'postgres',    # Usuário padrão
            'password': 'postgres', # Senha padrão
            'connect_timeout': 10
        }
        
        print("🔌 Tentando conectar com usuário postgres...")
        start_time = time.time()
        
        conn = psycopg.connect(**config)
        connection_time = time.time() - start_time
        
        print(f"✅ Conexão estabelecida em {connection_time:.2f} segundos!")
        
        # Testa query simples
        with conn.cursor() as cursor:
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"✅ PostgreSQL versão: {version[0]}")
            
            # Lista os bancos de dados
            cursor.execute("SELECT datname FROM pg_database;")
            databases = cursor.fetchall()
            print(f"✅ Bancos de dados existentes:")
            for db in databases:
                print(f"   - {db[0]}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Erro na conexão alternativa: {e}")
        return False

def main():
    """Função principal"""
    print("🚀 Testando conectividade com servidor PostgreSQL...")
    print("=" * 60)
    
    # Testa conectividade de rede
    rede_ok = testar_conectividade_rede()
    
    if rede_ok:
        # Testa conexão PostgreSQL com usuário BASE
        postgres_ok = testar_conexao_postgres()
        
        if postgres_ok:
            print("\n🎉 Conectividade testada com sucesso!")
            print("✅ Rede: OK")
            print("✅ PostgreSQL: OK")
            return True
        else:
            print("\n⚠️ Tentando conexão alternativa...")
            # Testa conexão alternativa
            postgres_alt_ok = testar_conexao_postgres_alternativa()
            
            if postgres_alt_ok:
                print("\n⚠️ Conexão alternativa funcionou!")
                print("✅ Rede: OK")
                print("⚠️ PostgreSQL: OK (usuário postgres)")
                print("❌ PostgreSQL: FALHOU (usuário BASE)")
                return True
            else:
                print("\n❌ Ambas as conexões falharam")
                print("✅ Rede: OK")
                print("❌ PostgreSQL: FALHOU")
                return False
    else:
        print("\n❌ Problema de conectividade de rede")
        print("❌ Rede: FALHOU")
        print("❌ PostgreSQL: NÃO TESTADO")
        return False

if __name__ == "__main__":
    sucesso = main()
    exit(0 if sucesso else 1) 