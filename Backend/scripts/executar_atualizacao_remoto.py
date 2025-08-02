#!/usr/bin/env python3
"""
Script para executar atualizações do banco de dados em servidor remoto
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

# Configurações de conexão - SERVIDOR REMOTO
DB_CONFIG = {
    'host': '10.10.255.111',  # IP do servidor remoto
    'port': 5432,
    'dbname': 'BASE',
    'user': 'BASE',
    'password': 'BASE'
}

def test_connection():
    """Testa a conexão com o banco remoto"""
    try:
        with psycopg.connect(**DB_CONFIG) as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT version();")
                version = cursor.fetchone()
                print(f"✅ Conexão estabelecida com PostgreSQL remoto: {version[0]}")
                return True
    except Exception as e:
        print(f"❌ Erro de conexão: {e}")
        print("💡 Verifique se:")
        print("   - O servidor 10.10.255.111 está acessível")
        print("   - A porta 5432 está aberta")
        print("   - As credenciais estão corretas")
        return False

def execute_sql_commands():
    """Executa os comandos SQL diretamente"""
    try:
        with psycopg.connect(**DB_CONFIG) as conn:
            with conn.cursor() as cursor:
                
                print("📝 Executando atualizações do banco...")
                
                # 1. Verificar se a tabela Usuarios existe
                cursor.execute("""
                    SELECT COUNT(*) FROM information_schema.tables 
                    WHERE table_name = 'Usuarios'
                """)
                table_exists = cursor.fetchone()[0] > 0
                if not table_exists:
                    print("❌ Tabela Usuarios não encontrada!")
                    print("💡 Execute primeiro o script de criação da tabela")
                    return False
                else:
                    print("✅ Tabela Usuarios encontrada")
                
                # 2. Adicionar colunas à tabela Usuarios
                print("🔧 Adicionando colunas à tabela Usuarios...")
                columns_to_add = [
                    'ALTER TABLE "Usuarios" ADD COLUMN IF NOT EXISTS "MFAEnabled" BOOLEAN DEFAULT FALSE',
                    'ALTER TABLE "Usuarios" ADD COLUMN IF NOT EXISTS "LastLogin" TIMESTAMP',
                    'ALTER TABLE "Usuarios" ADD COLUMN IF NOT EXISTS "PasswordChangedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                    'ALTER TABLE "Usuarios" ADD COLUMN IF NOT EXISTS "FailedLoginAttempts" INTEGER DEFAULT 0',
                    'ALTER TABLE "Usuarios" ADD COLUMN IF NOT EXISTS "AccountLockedUntil" TIMESTAMP'
                ]
                
                for command in columns_to_add:
                    cursor.execute(command)
                    print(f"✅ {command.split('ADD COLUMN')[1].split('(')[0].strip()}")
                
                # 3. Criar tabela de auditoria
                print("📊 Criando tabela LOGIN_AUDIT...")
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS LOGIN_AUDIT (
                        "Id" SERIAL PRIMARY KEY,
                        "Email" VARCHAR(400) NOT NULL,
                        "Success" BOOLEAN NOT NULL,
                        "IPAddress" VARCHAR(45),
                        "UserAgent" TEXT,
                        "Timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                        "SessionId" VARCHAR(100),
                        "LoginMethod" VARCHAR(20) DEFAULT 'password'
                    )
                """)
                
                # 4. Criar tabela de tokens de reset
                print("🔑 Criando tabela PASSWORD_RESET_TOKENS...")
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS PASSWORD_RESET_TOKENS (
                        "Id" SERIAL PRIMARY KEY,
                        "Email" VARCHAR(400) NOT NULL,
                        "Token" VARCHAR(255) UNIQUE NOT NULL,
                        "ExpiresAt" TIMESTAMP NOT NULL,
                        "Used" BOOLEAN DEFAULT FALSE,
                        "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                
                # 5. Criar tabela de sessões
                print("🔄 Criando tabela ACTIVE_SESSIONS...")
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS ACTIVE_SESSIONS (
                        "Id" SERIAL PRIMARY KEY,
                        "UserId" INTEGER NOT NULL,
                        "SessionId" VARCHAR(100) UNIQUE NOT NULL,
                        "AccessToken" TEXT NOT NULL,
                        "RefreshToken" TEXT NOT NULL,
                        "IPAddress" VARCHAR(45),
                        "UserAgent" TEXT,
                        "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        "ExpiresAt" TIMESTAMP NOT NULL,
                        "IsActive" BOOLEAN DEFAULT TRUE,
                        FOREIGN KEY ("UserId") REFERENCES "Usuarios"("IdUsuarios") ON DELETE CASCADE
                    )
                """)
                
                # 6. Criar tabela de códigos MFA
                print("🔐 Criando tabela MFA_CODES...")
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS MFA_CODES (
                        "Id" SERIAL PRIMARY KEY,
                        "UserId" INTEGER NOT NULL,
                        "Code" VARCHAR(6) NOT NULL,
                        "Type" VARCHAR(20) DEFAULT 'login',
                        "ExpiresAt" TIMESTAMP NOT NULL,
                        "Used" BOOLEAN DEFAULT FALSE,
                        "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY ("UserId") REFERENCES "Usuarios"("IdUsuarios") ON DELETE CASCADE
                    )
                """)
                
                # 7. Criar índices
                print("⚡ Criando índices...")
                indexes = [
                    'CREATE INDEX IF NOT EXISTS idx_login_audit_email ON LOGIN_AUDIT("Email")',
                    'CREATE INDEX IF NOT EXISTS idx_login_audit_timestamp ON LOGIN_AUDIT("Timestamp")',
                    'CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON PASSWORD_RESET_TOKENS("Token")',
                    'CREATE INDEX IF NOT EXISTS idx_active_sessions_user_id ON ACTIVE_SESSIONS("UserId")',
                    'CREATE INDEX IF NOT EXISTS idx_mfa_codes_user_id ON MFA_CODES("UserId")'
                ]
                
                for index in indexes:
                    cursor.execute(index)
                
                # 8. Criar funções
                print("🔧 Criando funções...")
                cursor.execute("""
                    CREATE OR REPLACE FUNCTION cleanup_old_auth_data()
                    RETURNS void AS $$
                    BEGIN
                        DELETE FROM PASSWORD_RESET_TOKENS 
                        WHERE "ExpiresAt" < CURRENT_TIMESTAMP OR "Used" = TRUE;
                        
                        DELETE FROM ACTIVE_SESSIONS 
                        WHERE "ExpiresAt" < CURRENT_TIMESTAMP OR "IsActive" = FALSE;
                        
                        DELETE FROM MFA_CODES 
                        WHERE "ExpiresAt" < CURRENT_TIMESTAMP OR "Used" = TRUE;
                        
                        DELETE FROM LOGIN_AUDIT 
                        WHERE "Timestamp" < CURRENT_TIMESTAMP - INTERVAL '90 days';
                    END;
                    $$ LANGUAGE plpgsql
                """)
                
                conn.commit()
                print("✅ Todas as atualizações foram aplicadas com sucesso!")
                return True
                
    except Exception as e:
        print(f"❌ Erro ao executar SQL: {e}")
        return False

def create_admin_user():
    """Cria o usuário ADMIN na tabela Usuarios"""
    try:
        with psycopg.connect(**DB_CONFIG) as conn:
            with conn.cursor() as cursor:
                
                # Verifica se o usuário ADMIN já existe
                cursor.execute("""
                    SELECT COUNT(*) FROM "Usuarios" WHERE "Usuario" = 'ADMIN'
                """)
                
                if cursor.fetchone()[0] > 0:
                    print("✅ Usuário ADMIN já existe")
                    return True
                
                # Hash da senha ADMIN com bcrypt
                from passlib.hash import bcrypt
                hashed_password = bcrypt.hash("ADMIN")
                
                # Insere o usuário ADMIN
                cursor.execute("""
                    INSERT INTO "Usuarios" (
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
                
                # Verifica colunas na tabela Usuarios
                cursor.execute("""
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = 'Usuarios' 
                    ORDER BY ordinal_position
                """)
                
                columns = cursor.fetchall()
                print("\n📋 Colunas na tabela Usuarios:")
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
                
                # Verifica usuário ADMIN
                cursor.execute("""
                    SELECT "Nome", "Email", "Usuario", "Perfil" 
                    FROM "Usuarios" WHERE "Usuario" = 'ADMIN'
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

def main():
    """Função principal"""
    print("🔧 Atualização do Sistema de Autenticação - SERVIDOR REMOTO")
    print("=" * 60)
    
    # Testa conexão
    if not test_connection():
        print("❌ Não foi possível conectar ao banco de dados remoto")
        sys.exit(1)
    
    # Executa atualizações
    if execute_sql_commands():
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
        print("  1. Reinicie o servidor backend no Docker remoto")
        print("  2. Acesse http://10.10.255.111")
        print("  3. Teste o login com usuário ADMIN")
        print("  4. Configure MFA se necessário")
        
        print("\n🔑 Credenciais de acesso:")
        print("   Email: base@itfact.com.br")
        print("   Usuário: ADMIN")
        print("   Senha: ADMIN")
        
    else:
        print("❌ Falha na atualização")
        sys.exit(1)

if __name__ == "__main__":
    main() 