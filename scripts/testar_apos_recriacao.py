#!/usr/bin/env python3
"""
Script para testar conectividade após recriar containers
"""

import requests
import psycopg
import time
import sys

def testar_conectividade():
    """Testa conectividade com todos os serviços"""
    
    print("🧪 TESTANDO CONECTIVIDADE APÓS RECRIAÇÃO")
    print("=" * 50)
    
    # 1. Testar Traefik Dashboard
    print("\n1️⃣ Testando Traefik Dashboard...")
    try:
        response = requests.get("http://10.10.255.111/traefik", timeout=10)
        if response.status_code == 200:
            print("✅ Traefik Dashboard acessível")
        else:
            print(f"⚠️ Traefik Dashboard retornou status {response.status_code}")
    except Exception as e:
        print(f"❌ Erro ao acessar Traefik: {e}")
    
    # 2. Testar Grafana
    print("\n2️⃣ Testando Grafana...")
    try:
        response = requests.get("http://10.10.255.111/grafana", timeout=10)
        if response.status_code == 200:
            print("✅ Grafana acessível")
        else:
            print(f"⚠️ Grafana retornou status {response.status_code}")
    except Exception as e:
        print(f"❌ Erro ao acessar Grafana: {e}")
    
    # 3. Testar Frontend
    print("\n3️⃣ Testando Frontend...")
    try:
        response = requests.get("http://10.10.255.111", timeout=10)
        if response.status_code == 200:
            print("✅ Frontend acessível")
        else:
            print(f"⚠️ Frontend retornou status {response.status_code}")
    except Exception as e:
        print(f"❌ Erro ao acessar Frontend: {e}")
    
    # 4. Testar Backend API
    print("\n4️⃣ Testando Backend API...")
    try:
        response = requests.get("http://10.10.255.111/api/health", timeout=10)
        if response.status_code == 200:
            print("✅ Backend API acessível")
            print(f"   Resposta: {response.json()}")
        else:
            print(f"⚠️ Backend API retornou status {response.status_code}")
    except Exception as e:
        print(f"❌ Erro ao acessar Backend API: {e}")
    
    # 5. Testar PostgreSQL
    print("\n5️⃣ Testando PostgreSQL...")
    try:
        conn = psycopg.connect(
            host="10.10.255.111",
            dbname="BASE",
            user="BASE",
            password="BASE",
            port=5432
        )
        
        with conn.cursor() as cur:
            # Verificar se a tabela Usuarios existe
            cur.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'BASE' AND table_name = 'Usuarios'
            """)
            
            if cur.fetchone():
                print("✅ Tabela 'Usuarios' encontrada")
                
                # Verificar se o usuário ADMIN existe
                cur.execute('SELECT "Usuario", "Email", "Nome" FROM "BASE"."Usuarios" WHERE "Usuario" = %s', ('ADMIN',))
                user = cur.fetchone()
                
                if user:
                    print(f"✅ Usuário ADMIN encontrado: {user}")
                else:
                    print("⚠️ Usuário ADMIN não encontrado")
            else:
                print("❌ Tabela 'Usuarios' não encontrada")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Erro ao conectar no PostgreSQL: {e}")
    
    # 6. Testar RabbitMQ
    print("\n6️⃣ Testando RabbitMQ...")
    try:
        response = requests.get("http://10.10.255.111/rabbitmq", timeout=10)
        if response.status_code == 200:
            print("✅ RabbitMQ acessível")
        else:
            print(f"⚠️ RabbitMQ retornou status {response.status_code}")
    except Exception as e:
        print(f"❌ Erro ao acessar RabbitMQ: {e}")
    
    print("\n" + "=" * 50)
    print("🏁 TESTE CONCLUÍDO!")

if __name__ == "__main__":
    testar_conectividade() 