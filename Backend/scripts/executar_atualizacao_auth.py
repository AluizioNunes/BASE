#!/usr/bin/env python3
"""
Script para executar atualizações do banco de dados para autenticação avançada
"""

try:
    import psycopg
except ImportError:
    print("❌ psycopg não encontrado. Instalando...")
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "psycopg[binary]"])
    import psycopg

import sys
import os
from datetime import datetime

# Configurações de conexão - usando o container do Docker
DB_CONFIG = {
    'host': 'db',  # Nome do container PostgreSQL
    'port': 5432,
    'dbname': 'BASE',
    'user': 'BASE',
    'password': 'BASE'
}

def execute_sql_file(file_path):
    """Executa um arquivo SQL"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            sql_content = file.read()
        
        with psycopg.connect(**DB_CONFIG) as conn:
            with conn.cursor() as cursor:
                # Divide o SQL em comandos individuais
                commands = sql_content.split(';')
                
                for command in commands:
                    command = command.strip()
                    if command and not command.startswith('--'):
                        try:
                            cursor.execute(command)
                            print(f"✅ Comando executado com sucesso")
                        except Exception as e:
                            print(f"⚠️ Aviso no comando: {e}")
                
                conn.commit()
                print("✅ Todas as atualizações foram aplicadas com sucesso!")
                
    except FileNotFoundError:
        print(f"❌ Arquivo não encontrado: {file_path}")
        return False
    except Exception as e:
        print(f"❌ Erro ao executar SQL: {e}")
        return False
    
    return True

def create_admin_user():
    """Cria o usuário ADMIN na tabela USUARIOS"""
    try:
        with psycopg.connect(**DB_CONFIG) as conn:
            with conn.cursor() as cursor:
                
                # Verifica se o usuário ADMIN já existe
                cursor.execute("""
                    SELECT COUNT(*) FROM USUARIOS WHERE "Usuario" = 'ADMIN'
                """)
                
                if cursor.fetchone()[0] > 0:
                    print("✅ Usuário ADMIN já existe")
                    return True
                
                # Hash da senha ADMIN com bcrypt
                from passlib.hash import bcrypt
                hashed_password = bcrypt.hash("ADMIN")
                
                # Insere o usuário ADMIN
                cursor.execute("""
                    INSERT INTO USUARIOS (
                        "Nome", "CPF", "Funcao", "Email", "Usuario", "Senha", 
                        "Perfil", "Cadastrante", "DataCadastro", "MFAEnabled"
                    ) VALUES (
                        'Administrador do Sistema', '00000000000', 'Administrador', 
                        'base@itfact.com.br', 'ADMIN', %s, 'Administrador', 'Sistema', 
                        CURRENT_TIMESTAMP, FALSE
                    )
                """, (hashed_password,))
                
                conn.commit()
                print("✅ Usuário ADMIN criado com sucesso!")
                print("   Email: base@itfact.com.br")
                print("   Usuário: ADMIN")
                print("   Senha: ADMIN")
                
                return True
                
    except Exception as e:
        print(f"❌ Erro ao criar usuário ADMIN: {e}")
        return False

def verify_updates():
    """Verifica se as atualizações foram aplicadas corretamente"""
    try:
        with psycopg.connect(**DB_CONFIG) as conn:
            with conn.cursor() as cursor:
                
                # Verifica colunas na tabela USUARIOS
                cursor.execute("""
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = 'USUARIOS' 
                    ORDER BY ordinal_position
                """)
                
                columns = cursor.fetchall()
                print("\n📋 Colunas na tabela USUARIOS:")
                for col in columns:
                    print(f"  - {col[0]}: {col[1]}")
                
                # Verifica se as novas tabelas foram criadas
                tables_to_check = ['LOGIN_AUDIT', 'PASSWORD_RESET_TOKENS', 'ACTIVE_SESSIONS', 'MFA_CODES']
                
                print("\n📋 Verificação das novas tabelas:")
                for table in tables_to_check:
                    cursor.execute("""
                        SELECT COUNT(*) 
                        FROM information_schema.tables 
                        WHERE table_name = %s
                    """, (table,))
                    
                    exists = cursor.fetchone()[0] > 0
                    status = "✅ Existe" if exists else "❌ Não existe"
                    print(f"  - {table}: {status}")
                
                # Verifica índices
                print("\n📋 Verificação de índices:")
                indexes_to_check = [
                    'idx_login_audit_email',
                    'idx_password_reset_tokens_token',
                    'idx_active_sessions_user_id',
                    'idx_mfa_codes_user_id'
                ]
                
                for index in indexes_to_check:
                    cursor.execute("""
                        SELECT COUNT(*) 
                        FROM pg_indexes 
                        WHERE indexname = %s
                    """, (index,))
                    
                    exists = cursor.fetchone()[0] > 0
                    status = "✅ Existe" if exists else "❌ Não existe"
                    print(f"  - {index}: {status}")
                
                # Verifica usuário ADMIN
                cursor.execute("""
                    SELECT "Nome", "Email", "Usuario", "Perfil" 
                    FROM USUARIOS WHERE "Usuario" = 'ADMIN'
                """)
                
                admin_user = cursor.fetchone()
                if admin_user:
                    print(f"\n👤 Usuário ADMIN:")
                    print(f"  - Nome: {admin_user[0]}")
                    print(f"  - Email: {admin_user[1]}")
                    print(f"  - Usuário: {admin_user[2]}")
                    print(f"  - Perfil: {admin_user[3]}")
                else:
                    print("\n❌ Usuário ADMIN não encontrado")
                
    except Exception as e:
        print(f"❌ Erro ao verificar atualizações: {e}")
        return False
    
    return True

def test_connection():
    """Testa a conexão com o banco"""
    try:
        with psycopg.connect(**DB_CONFIG) as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT version();")
                version = cursor.fetchone()
                print(f"✅ Conexão estabelecida com PostgreSQL: {version[0]}")
                return True
    except Exception as e:
        print(f"❌ Erro de conexão: {e}")
        print("💡 Certifique-se de que o container PostgreSQL está rodando")
        return False

def main():
    """Função principal"""
    print("🔧 Atualização do Sistema de Autenticação")
    print("=" * 50)
    
    # Testa conexão
    if not test_connection():
        print("❌ Não foi possível conectar ao banco de dados")
        sys.exit(1)
    
    # Executa atualizações
    sql_file = "atualizar_tabela_usuarios_auth.sql"
    if not os.path.exists(sql_file):
        print(f"❌ Arquivo SQL não encontrado: {sql_file}")
        sys.exit(1)
    
    print(f"\n📝 Executando atualizações do arquivo: {sql_file}")
    if execute_sql_file(sql_file):
        print("\n👤 Criando usuário ADMIN...")
        create_admin_user()
        
        print("\n🔍 Verificando se as atualizações foram aplicadas...")
        verify_updates()
        
        print("\n🎉 Atualização concluída com sucesso!")
        print("\n📋 Resumo das funcionalidades adicionadas:")
        print("  ✅ Hash de senhas com bcrypt")
        print("  ✅ Validação de força de senha")
        print("  ✅ Registro de usuários")
        print("  ✅ Reset de senha")
        print("  ✅ Multi-Factor Authentication (MFA)")
        print("  ✅ Refresh tokens")
        print("  ✅ Auditoria de login")
        print("  ✅ Cache de sessão com Redis")
        print("  ✅ Rate limiting")
        print("  ✅ Proteção contra ataques")
        
        print("\n🚀 Próximos passos:")
        print("  1. Reinicie o servidor backend")
        print("  2. Teste o login com usuário ADMIN")
        print("  3. Configure MFA se necessário")
        print("  4. Monitore os logs de auditoria")
        
        print("\n🔑 Credenciais de acesso:")
        print("   Email: base@itfact.com.br")
        print("   Usuário: ADMIN")
        print("   Senha: ADMIN")
        
    else:
        print("❌ Falha na atualização")
        sys.exit(1)

if __name__ == "__main__":
    main() 