#!/usr/bin/env python3
"""
Script completo para testar todas as possibilidades de conexão com PostgreSQL
"""
import socket
import time
import psycopg
import os
import sys
from datetime import datetime

def print_header(title):
    """Imprime cabeçalho formatado"""
    print(f"\n{'='*60}")
    print(f"🔍 {title}")
    print(f"{'='*60}")

def print_result(test_name, success, details=""):
    """Imprime resultado formatado"""
    status = "✅ PASSOU" if success else "❌ FALHOU"
    print(f"{test_name:<30} {status}")
    if details:
        print(f"{'':30} {details}")

def test_network_connectivity():
    """Testa conectividade de rede básica"""
    print_header("TESTE DE CONECTIVIDADE DE REDE")
    
    # Teste 1: Ping
    print("📡 Testando ping para 10.10.255.111...")
    try:
        import subprocess
        result = subprocess.run(['ping', '-n', '1', '10.10.255.111'], 
                              capture_output=True, text=True, timeout=10)
        ping_ok = result.returncode == 0
        print_result("Ping", ping_ok, f"TTL: {result.stdout.split('TTL=')[1].split()[0] if ping_ok else 'Falhou'}")
    except Exception as e:
        print_result("Ping", False, str(e))

    # Teste 2: Porta SSH (22)
    print("\n🔐 Testando porta SSH (22)...")
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        start_time = time.time()
        result = sock.connect_ex(('10.10.255.111', 22))
        connection_time = time.time() - start_time
        sock.close()
        ssh_ok = result == 0
        print_result("SSH (22)", ssh_ok, f"Tempo: {connection_time:.2f}s")
    except Exception as e:
        print_result("SSH (22)", False, str(e))

    # Teste 3: Porta PostgreSQL (5432)
    print("\n🐘 Testando porta PostgreSQL (5432)...")
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(10)
        start_time = time.time()
        result = sock.connect_ex(('10.10.255.111', 5432))
        connection_time = time.time() - start_time
        sock.close()
        postgres_port_ok = result == 0
        print_result("PostgreSQL (5432)", postgres_port_ok, f"Tempo: {connection_time:.2f}s (erro: {result})")
    except Exception as e:
        print_result("PostgreSQL (5432)", False, str(e))

    return ping_ok, ssh_ok, postgres_port_ok

def test_postgres_connections():
    """Testa diferentes configurações de conexão PostgreSQL"""
    print_header("TESTE DE CONEXÕES POSTGRESQL")
    
    # Configurações para testar
    configs = [
        {
            'name': 'BASE:BASE@BASE',
            'host': '10.10.255.111',
            'port': 5432,
            'dbname': 'BASE',
            'user': 'BASE',
            'password': 'BASE',
            'connect_timeout': 10
        },
        {
            'name': 'postgres:postgres@postgres',
            'host': '10.10.255.111',
            'port': 5432,
            'dbname': 'postgres',
            'user': 'postgres',
            'password': 'postgres',
            'connect_timeout': 10
        },
        {
            'name': 'BASE:BASE@postgres',
            'host': '10.10.255.111',
            'port': 5432,
            'dbname': 'postgres',
            'user': 'BASE',
            'password': 'BASE',
            'connect_timeout': 10
        },
        {
            'name': 'postgres:postgres@BASE',
            'host': '10.10.255.111',
            'port': 5432,
            'dbname': 'BASE',
            'user': 'postgres',
            'password': 'postgres',
            'connect_timeout': 10
        }
    ]
    
    results = []
    
    for config in configs:
        print(f"\n🔌 Testando: {config['name']}")
        try:
            start_time = time.time()
            conn = psycopg.connect(**{k: v for k, v in config.items() if k != 'name'})
            connection_time = time.time() - start_time
            
            # Testa query básica
            with conn.cursor() as cursor:
                cursor.execute("SELECT version();")
                version = cursor.fetchone()
                
                cursor.execute("SELECT current_database();")
                db_name = cursor.fetchone()
                
                cursor.execute("SELECT current_user;")
                user = cursor.fetchone()
            
            conn.close()
            
            success = True
            details = f"Tempo: {connection_time:.2f}s | DB: {db_name[0]} | User: {user[0]}"
            print_result(config['name'], success, details)
            results.append((config['name'], True, details))
            
        except Exception as e:
            success = False
            details = str(e)
            print_result(config['name'], success, details)
            results.append((config['name'], False, details))
    
    return results

def test_url_connections():
    """Testa conexões usando URLs"""
    print_header("TESTE DE CONEXÕES POR URL")
    
    urls = [
        'postgresql://BASE:BASE@10.10.255.111:5432/BASE',
        'postgresql://postgres:postgres@10.10.255.111:5432/postgres',
        'postgresql://BASE:BASE@10.10.255.111:5432/postgres',
        'postgresql://postgres:postgres@10.10.255.111:5432/BASE'
    ]
    
    results = []
    
    for url in urls:
        print(f"\n🔗 Testando URL: {url}")
        try:
            start_time = time.time()
            conn = psycopg.connect(url)
            connection_time = time.time() - start_time
            
            # Testa query básica
            with conn.cursor() as cursor:
                cursor.execute("SELECT version();")
                version = cursor.fetchone()
                
                cursor.execute("SELECT current_database();")
                db_name = cursor.fetchone()
            
            conn.close()
            
            success = True
            details = f"Tempo: {connection_time:.2f}s | DB: {db_name[0]}"
            print_result("URL Connection", success, details)
            results.append((url, True, details))
            
        except Exception as e:
            success = False
            details = str(e)
            print_result("URL Connection", success, details)
            results.append((url, False, details))
    
    return results

def test_database_operations():
    """Testa operações no banco de dados"""
    print_header("TESTE DE OPERAÇÕES NO BANCO")
    
    # Tenta conectar com a primeira configuração que funcionou
    config = {
        'host': '10.10.255.111',
        'port': 5432,
        'dbname': 'postgres',  # Banco padrão
        'user': 'postgres',    # Usuário padrão
        'password': 'postgres', # Senha padrão
        'connect_timeout': 10
    }
    
    try:
        conn = psycopg.connect(**config)
        print("✅ Conectado! Testando operações...")
        
        with conn.cursor() as cursor:
            # Lista bancos de dados
            print("\n📋 Bancos de dados existentes:")
            cursor.execute("SELECT datname FROM pg_database WHERE datistemplate = false;")
            databases = cursor.fetchall()
            for db in databases:
                print(f"   - {db[0]}")
            
            # Lista usuários
            print("\n👥 Usuários existentes:")
            cursor.execute("SELECT usename FROM pg_user;")
            users = cursor.fetchall()
            for user in users:
                print(f"   - {user[0]}")
            
            # Verifica se o banco BASE existe
            base_exists = any(db[0] == 'BASE' for db in databases)
            print(f"\n🏗️ Banco 'BASE' existe: {'✅ SIM' if base_exists else '❌ NÃO'}")
            
            # Se BASE não existe, tenta criar
            if not base_exists:
                print("🔨 Tentando criar banco 'BASE'...")
                try:
                    cursor.execute("CREATE DATABASE BASE;")
                    conn.commit()
                    print("✅ Banco 'BASE' criado com sucesso!")
                except Exception as e:
                    print(f"❌ Erro ao criar banco: {e}")
            
            # Verifica se o usuário BASE existe
            base_user_exists = any(user[0] == 'BASE' for user in users)
            print(f"👤 Usuário 'BASE' existe: {'✅ SIM' if base_user_exists else '❌ NÃO'}")
            
            # Se BASE não existe, tenta criar
            if not base_user_exists:
                print("🔨 Tentando criar usuário 'BASE'...")
                try:
                    cursor.execute("CREATE USER BASE WITH PASSWORD 'BASE';")
                    cursor.execute("GRANT ALL PRIVILEGES ON DATABASE BASE TO BASE;")
                    conn.commit()
                    print("✅ Usuário 'BASE' criado com sucesso!")
                except Exception as e:
                    print(f"❌ Erro ao criar usuário: {e}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Erro na conexão: {e}")
        return False

def test_sqlalchemy_connection():
    """Testa conexão via SQLAlchemy"""
    print_header("TESTE DE CONEXÃO SQLALCHEMY")
    
    try:
        from sqlalchemy import create_engine, text
        
        # Testa diferentes URLs
        urls = [
            'postgresql+psycopg://BASE:BASE@10.10.255.111:5432/BASE',
            'postgresql+psycopg://postgres:postgres@10.10.255.111:5432/postgres',
            'postgresql+psycopg://BASE:BASE@10.10.255.111:5432/postgres'
        ]
        
        for url in urls:
            print(f"\n🔧 Testando SQLAlchemy URL: {url}")
            try:
                engine = create_engine(url, connect_args={"connect_timeout": 10})
                
                with engine.connect() as conn:
                    result = conn.execute(text("SELECT version();"))
                    version = result.fetchone()
                    print(f"✅ SQLAlchemy funcionou! Versão: {version[0]}")
                    return True
                    
            except Exception as e:
                print(f"❌ SQLAlchemy falhou: {e}")
        
        return False
        
    except ImportError:
        print("❌ SQLAlchemy não disponível")
        return False

def main():
    """Função principal"""
    print("🚀 TESTE COMPLETO DE CONECTIVIDADE POSTGRESQL")
    print(f"📅 Data/Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🖥️ Sistema: {os.name}")
    print(f"🐍 Python: {sys.version}")
    
    # Teste 1: Conectividade de rede
    ping_ok, ssh_ok, postgres_port_ok = test_network_connectivity()
    
    # Teste 2: Conexões PostgreSQL
    if postgres_port_ok:
        postgres_results = test_postgres_connections()
        url_results = test_url_connections()
        
        # Teste 3: Operações no banco
        db_ops_ok = test_database_operations()
        
        # Teste 4: SQLAlchemy
        sqlalchemy_ok = test_sqlalchemy_connection()
    else:
        print("\n⚠️ Pulando testes PostgreSQL - porta 5432 não acessível")
        postgres_results = []
        url_results = []
        db_ops_ok = False
        sqlalchemy_ok = False
    
    # Resumo final
    print_header("RESUMO FINAL")
    
    print_result("Ping", ping_ok)
    print_result("SSH (22)", ssh_ok)
    print_result("PostgreSQL (5432)", postgres_port_ok)
    
    if postgres_results:
        successful_connections = sum(1 for _, success, _ in postgres_results if success)
        print_result("Conexões PostgreSQL", successful_connections > 0, f"{successful_connections}/{len(postgres_results)} funcionaram")
    
    if url_results:
        successful_urls = sum(1 for _, success, _ in url_results if success)
        print_result("Conexões por URL", successful_urls > 0, f"{successful_urls}/{len(url_results)} funcionaram")
    
    print_result("Operações no Banco", db_ops_ok)
    print_result("SQLAlchemy", sqlalchemy_ok)
    
    # Recomendações
    print_header("RECOMENDAÇÕES")
    
    if not postgres_port_ok:
        print("🔧 A porta 5432 não está acessível. Verifique:")
        print("   - Se o container Docker está expondo a porta 5432")
        print("   - Se há firewall bloqueando a porta")
        print("   - Se o PostgreSQL está configurado para aceitar conexões externas")
    
    if postgres_port_ok and not any(success for _, success, _ in postgres_results):
        print("🔧 A porta está acessível mas as credenciais estão incorretas. Verifique:")
        print("   - Usuário e senha do PostgreSQL")
        print("   - Se o banco de dados existe")
        print("   - Permissões do usuário")
    
    if any(success for _, success, _ in postgres_results):
        print("🎉 Conexão funcionando! Você pode prosseguir com o desenvolvimento.")
    
    return postgres_port_ok and any(success for _, success, _ in postgres_results)

if __name__ == "__main__":
    sucesso = main()
    sys.exit(0 if sucesso else 1) 