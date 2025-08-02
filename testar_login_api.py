#!/usr/bin/env python3
"""
Script para testar a API de login diretamente
"""

import requests
import json

# URL da API no servidor remoto (corrigida)
API_BASE_URL = "http://10.10.255.111/api/v1"

def testar_login():
    """Testa o login na API"""
    try:
        print("🔍 Testando API de login...")
        print(f"🌐 URL: {API_BASE_URL}/auth/login")
        
        # Teste 1: Login com email
        print("\n📧 Teste 1: Login com EMAIL")
        login_data_email = {
            "email_or_username": "base@itfact.com.br",
            "password": "ADMIN123"
        }
        
        print(f"📧 Email: {login_data_email['email_or_username']}")
        print(f"🔑 Senha: {login_data_email['password']}")
        
        response_email = requests.post(
            f"{API_BASE_URL}/auth/login",
            json=login_data_email,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"📊 Status Code: {response_email.status_code}")
        
        if response_email.status_code == 200:
            print("✅ Login com EMAIL bem-sucedido!")
            data = response_email.json()
            print(f"📄 Resposta: {json.dumps(data, indent=2)}")
        else:
            print("❌ Login com EMAIL falhou!")
            print(f"📄 Resposta: {response_email.text}")
        
        # Teste 2: Login com usuário
        print("\n👤 Teste 2: Login com USUÁRIO")
        login_data_user = {
            "email_or_username": "ADMIN",
            "password": "ADMIN123"
        }
        
        print(f"👤 Usuário: {login_data_user['email_or_username']}")
        print(f"🔑 Senha: {login_data_user['password']}")
        
        response_user = requests.post(
            f"{API_BASE_URL}/auth/login",
            json=login_data_user,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"📊 Status Code: {response_user.status_code}")
        
        if response_user.status_code == 200:
            print("✅ Login com USUÁRIO bem-sucedido!")
            data = response_user.json()
            print(f"📄 Resposta: {json.dumps(data, indent=2)}")
        else:
            print("❌ Login com USUÁRIO falhou!")
            print(f"📄 Resposta: {response_user.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Erro de conexão - API não está acessível")
        print("💡 Verifique se o container backend está rodando no servidor")
    except requests.exceptions.Timeout:
        print("❌ Timeout - API demorou muito para responder")
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")

def testar_health_check():
    """Testa se a API está respondendo"""
    try:
        print("\n🏥 Testando health check...")
        response = requests.get("http://10.10.255.111/", timeout=5)
        print(f"📊 Status: {response.status_code}")
        print(f"📄 Resposta: {response.text}")
    except Exception as e:
        print(f"❌ Health check falhou: {e}")

if __name__ == "__main__":
    print("🚀 Iniciando testes da API...")
    testar_health_check()
    testar_login() 