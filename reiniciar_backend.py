#!/usr/bin/env python3
"""
Script para reiniciar o container backend no servidor remoto
"""

import subprocess
import sys

def reiniciar_backend():
    """Reinicia o container backend no servidor remoto"""
    try:
        print("🔄 Reiniciando container backend...")
        
        # Comando para reiniciar o container backend
        comando = "docker restart backend"
        
        print(f"📋 Executando: {comando}")
        print("💡 Este comando deve ser executado no servidor remoto (10.10.255.111)")
        print("🔗 Conecte-se ao servidor e execute:")
        print(f"   ssh usuario@10.10.255.111")
        print(f"   {comando}")
        
        print("\n📝 Alternativamente, você pode:")
        print("1. Acessar o Portainer no servidor")
        print("2. Ir para Containers")
        print("3. Encontrar o container 'backend'")
        print("4. Clicar em 'Restart'")
        
        print("\n✅ Após reiniciar, teste novamente o login!")
        
    except Exception as e:
        print(f"❌ Erro: {e}")

if __name__ == "__main__":
    reiniciar_backend() 