#!/usr/bin/env python3
"""
Script para testar a configuração do backend
"""
import os
import sys

# Adiciona o diretório atual ao path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_config():
    """Testa a configuração do backend"""
    try:
        print("🔍 Testando configuração do backend...")
        
        # Testa importação da configuração
        from app.core.config import settings
        
        print("✅ Configuração importada com sucesso!")
        print(f"📋 APP_NAME: {settings.APP_NAME}")
        print(f"🌐 BACKEND_CORS_ORIGINS: {settings.BACKEND_CORS_ORIGINS}")
        print(f"📁 ALLOWED_EXTENSIONS: {settings.ALLOWED_EXTENSIONS}")
        print(f"🔧 DEBUG: {settings.DEBUG}")
        print(f"🗄️ DATABASE_URL: {settings.DATABASE_URL}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro na configuração: {e}")
        print(f"🔍 Tipo do erro: {type(e).__name__}")
        return False

if __name__ == "__main__":
    success = test_config()
    sys.exit(0 if success else 1) 