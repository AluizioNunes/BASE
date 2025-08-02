#!/usr/bin/env python3
"""
Script para executar comandos dentro do container Docker remoto
"""

import subprocess
import sys
import os

def executar_comando_remoto(comando):
    """Executa comando no servidor remoto via SSH"""
    try:
        # Comando para executar no servidor remoto
        ssh_comando = f'ssh root@10.10.255.111 "{comando}"'
        print(f"🔧 Executando: {comando}")
        
        result = subprocess.run(ssh_comando, shell=True, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Comando executado com sucesso")
            if result.stdout:
                print(result.stdout)
        else:
            print("❌ Erro ao executar comando")
            if result.stderr:
                print(result.stderr)
            return False
            
        return True
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def main():
    """Função principal"""
    print("🔧 Execução Remota via Docker")
    print("=" * 40)
    
    # 1. Verificar se o container backend está rodando
    print("\n📋 Verificando container backend...")
    if not executar_comando_remoto("docker ps | grep backend"):
        print("❌ Container backend não encontrado")
        return
    
    # 2. Executar script de criação da tabela
    print("\n📋 Criando tabela Usuarios...")
    comando_criar = '''
    docker exec -it backend python /app/scripts/criar_tabela_usuarios_remoto.py
    '''
    
    if not executar_comando_remoto(comando_criar):
        print("❌ Erro ao criar tabela")
        return
    
    # 3. Executar script de atualização
    print("\n📋 Aplicando atualizações de autenticação...")
    comando_atualizar = '''
    docker exec -it backend python /app/scripts/executar_atualizacao_remoto.py
    '''
    
    if not executar_comando_remoto(comando_atualizar):
        print("❌ Erro ao aplicar atualizações")
        return
    
    # 4. Reiniciar container backend
    print("\n📋 Reiniciando container backend...")
    comando_restart = '''
    docker restart backend
    '''
    
    if not executar_comando_remoto(comando_restart):
        print("❌ Erro ao reiniciar container")
        return
    
    print("\n🎉 Processo concluído com sucesso!")
    print("\n📋 Próximos passos:")
    print("  1. Acesse http://10.10.255.111")
    print("  2. Teste o login com usuário ADMIN")
    print("  3. Configure MFA se necessário")
    
    print("\n🔑 Credenciais de acesso:")
    print("   Email: base@itfact.com.br")
    print("   Usuário: ADMIN")
    print("   Senha: ADMIN")

if __name__ == "__main__":
    main() 