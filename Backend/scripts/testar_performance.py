#!/usr/bin/env python3
"""
Script para testar a performance do psycopg-binary
"""
import os
import sys
import time
import psycopg
from psycopg.rows import dict_row

def testar_conexao():
    """Testa a velocidade de conexão"""
    print("🔌 Testando velocidade de conexão...")
    
    config = {
        'host': os.getenv('DBHOST', '10.10.255.111'),  # Servidor Docker
        'port': os.getenv('DBPORT', '5432'),
        'dbname': os.getenv('DBNAME', 'BASE'),  # psycopg3 usa 'dbname'
        'user': os.getenv('DBUSER', 'BASE'),
        'password': os.getenv('DBPASSWORD', 'BASE')
    }
    
    # Teste de conexão
    start_time = time.time()
    conn = psycopg.connect(**config)
    connection_time = time.time() - start_time
    
    print(f"✅ Conexão estabelecida em {connection_time:.3f} segundos")
    
    return conn, connection_time

def testar_queries(conn):
    """Testa a velocidade de diferentes tipos de queries"""
    print("\n📊 Testando velocidade de queries...")
    
    with conn.cursor(row_factory=dict_row) as cursor:
        # Query simples
        start_time = time.time()
        cursor.execute("SELECT COUNT(*) as total FROM USUARIOS")
        result = cursor.fetchone()
        simple_query_time = time.time() - start_time
        
        print(f"✅ Query simples: {simple_query_time:.3f} segundos")
        
        # Query com filtro
        start_time = time.time()
        cursor.execute("SELECT * FROM USUARIOS WHERE \"Perfil\" = %s", ("Administrador",))
        admins = cursor.fetchall()
        filter_query_time = time.time() - start_time
        
        print(f"✅ Query com filtro: {filter_query_time:.3f} segundos")
        print(f"   - Encontrados {len(admins)} administradores")
        
        # Query complexa
        start_time = time.time()
        cursor.execute("""
            SELECT 
                "Perfil",
                COUNT(*) as total,
                AVG(LENGTH("Nome")) as media_nome
            FROM USUARIOS 
            GROUP BY "Perfil"
            ORDER BY total DESC
        """)
        stats = cursor.fetchall()
        complex_query_time = time.time() - start_time
        
        print(f"✅ Query complexa: {complex_query_time:.3f} segundos")
        print(f"   - Estatísticas por perfil:")
        for stat in stats:
            print(f"     * {stat['Perfil']}: {stat['total']} usuários")
        
        return {
            'simple': simple_query_time,
            'filter': filter_query_time,
            'complex': complex_query_time
        }

def testar_insercao(conn):
    """Testa a velocidade de inserção"""
    print("\n📝 Testando velocidade de inserção...")
    
    with conn.cursor() as cursor:
        # Insere usuário de teste
        start_time = time.time()
        cursor.execute("""
            INSERT INTO USUARIOS ("Nome", "CPF", "Funcao", "Email", "Usuario", "Senha", "Perfil", "Cadastrante")
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            "Usuário Teste",
            "999.999.999-99",
            "Teste",
            "teste@email.com",
            "teste.user",
            "senha_hash_teste",
            "Usuário",
            "Script de Teste"
        ))
        insert_time = time.time() - start_time
        
        print(f"✅ Inserção: {insert_time:.3f} segundos")
        
        # Remove o usuário de teste
        cursor.execute("DELETE FROM USUARIOS WHERE \"CPF\" = %s", ("999.999.999-99",))
        
        return insert_time

def testar_transacocoes(conn):
    """Testa a velocidade de transações"""
    print("\n💾 Testando velocidade de transações...")
    
    with conn.cursor() as cursor:
        # Transação simples
        start_time = time.time()
        with conn.transaction():
            cursor.execute("SELECT COUNT(*) FROM USUARIOS")
            count = cursor.fetchone()[0]
        transaction_time = time.time() - start_time
        
        print(f"✅ Transação simples: {transaction_time:.3f} segundos")
        print(f"   - Total de usuários: {count}")
        
        return transaction_time

def comparar_com_psycopg2():
    """Compara com psycopg2 se disponível"""
    print("\n🆚 Comparando com psycopg2...")
    
    try:
        import psycopg2
        print("✅ psycopg2 encontrado - fazendo comparação")
        
        # Teste com psycopg2
        config = {
            'host': os.getenv('DBHOST', '10.10.255.111'),  # Servidor Docker
            'port': os.getenv('DBPORT', '5432'),
            'database': os.getenv('DBNAME', 'BASE'),  # psycopg2 usa 'database'
            'user': os.getenv('DBUSER', 'BASE'),
            'password': os.getenv('DBPASSWORD', 'BASE')
        }
        
        start_time = time.time()
        conn2 = psycopg2.connect(**config)
        psycopg2_time = time.time() - start_time
        
        print(f"⏱️ psycopg2: {psycopg2_time:.3f} segundos")
        
        conn2.close()
        
    except ImportError:
        print("⚠️ psycopg2 não encontrado - pulando comparação")

def main():
    """Função principal"""
    print("🚀 Testando performance do psycopg-binary...")
    print("=" * 60)
    
    try:
        # Testa conexão
        conn, connection_time = testar_conexao()
        
        # Testa queries
        query_times = testar_queries(conn)
        
        # Testa inserção
        insert_time = testar_insercao(conn)
        
        # Testa transações
        transaction_time = testar_transacocoes(conn)
        
        # Compara com psycopg2
        comparar_com_psycopg2()
        
        # Resumo
        print("\n📈 Resumo da Performance:")
        print("-" * 40)
        print(f"🔌 Conexão: {connection_time:.3f}s")
        print(f"📊 Query simples: {query_times['simple']:.3f}s")
        print(f"🔍 Query com filtro: {query_times['filter']:.3f}s")
        print(f"📋 Query complexa: {query_times['complex']:.3f}s")
        print(f"📝 Inserção: {insert_time:.3f}s")
        print(f"💾 Transação: {transaction_time:.3f}s")
        
        total_time = connection_time + sum(query_times.values()) + insert_time + transaction_time
        print(f"\n⏱️ Tempo total: {total_time:.3f}s")
        
        print("\n✅ Teste de performance concluído!")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Erro durante o teste: {e}")
        return False
    
    return True

if __name__ == "__main__":
    sucesso = main()
    sys.exit(0 if sucesso else 1) 