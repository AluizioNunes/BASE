#!/usr/bin/env python3
"""
Script para atualizar a senha do usuário ADMIN
"""

import psycopg
import bcrypt
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Configuração do banco de dados
DB_CONFIG = {
    'host': '10.10.255.111',
    'port': 5432,
    'dbname': 'BASE',
    'user': 'BASE',
    'password': 'BASE'
}

def atualizar_senha_admin():
    """Atualiza a senha do usuário ADMIN"""
    try:
        # Conectar ao banco
        with psycopg.connect(**DB_CONFIG) as conn:
            with conn.cursor() as cur:
                print("🔗 Conectado ao banco de dados...")
                
                # Nova senha: ADMIN123 (8 caracteres)
                nova_senha = "ADMIN123"
                
                # Gerar hash da senha
                salt = bcrypt.gensalt()
                senha_hash = bcrypt.hashpw(nova_senha.encode('utf-8'), salt)
                
                # Atualizar a senha do usuário ADMIN
                cur.execute("""
                    UPDATE "Usuarios" 
                    SET "Senha" = %s 
                    WHERE "Usuario" = 'ADMIN'
                """, (senha_hash.decode('utf-8'),))
                
                # Verificar se foi atualizado
                if cur.rowcount > 0:
                    conn.commit()
                    print("✅ Senha do usuário ADMIN atualizada com sucesso!")
                    print(f"📧 Email: base@itfact.com.br")
                    print(f"👤 Usuário: ADMIN")
                    print(f"🔑 Nova senha: {nova_senha}")
                    print(f"🔐 Hash gerado: {senha_hash.decode('utf-8')[:20]}...")
                else:
                    print("❌ Usuário ADMIN não encontrado!")
                    
    except Exception as e:
        print(f"❌ Erro ao atualizar senha: {e}")

if __name__ == "__main__":
    print("🔄 Atualizando senha do usuário ADMIN...")
    atualizar_senha_admin() 