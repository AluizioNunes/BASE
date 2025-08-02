#!/usr/bin/env python3
"""
Script para criar tabela Usuarios no servidor remoto
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

def create_usuarios_table():
    """Cria a tabela Usuarios"""
    try:
        with psycopg.connect(**DB_CONFIG) as conn:
            with conn.cursor() as cursor:
                
                print("📝 Criando tabela Usuarios...")
                
                # Executa o script SQL
                sql_commands = [
                    "DROP TABLE IF EXISTS \"Usuarios\" CASCADE",
                    """
                    CREATE TABLE "Usuarios" (
                        "IdUsuarios" SERIAL PRIMARY KEY,
                        "Nome" VARCHAR(300) NOT NULL,
                        "CPF" VARCHAR(14) UNIQUE NOT NULL,
                        "Funcao" VARCHAR(300) NOT NULL,
                        "Email" VARCHAR(400) UNIQUE NOT NULL,
                        "Usuario" VARCHAR(200) UNIQUE NOT NULL,
                        "Senha" VARCHAR(200) NOT NULL,
                        "Perfil" VARCHAR(300) NOT NULL,
                        "Cadastrante" VARCHAR(400) NOT NULL,
                        "DataCadastro" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
                    )
                    """,
                    "CREATE INDEX idx_usuarios_cpf ON \"Usuarios\"(\"CPF\")",
                    "CREATE INDEX idx_usuarios_email ON \"Usuarios\"(\"Email\")",
                    "CREATE INDEX idx_usuarios_usuario ON \"Usuarios\"(\"Usuario\")",
                    """
                    INSERT INTO "Usuarios" ("Nome", "CPF", "Funcao", "Email", "Usuario", "Senha", "Perfil", "Cadastrante") VALUES
                    ('Administrador do Sistema', '00000000000', 'Administrador', 'base@itfact.com.br', 'ADMIN', 'ADMIN', 'Administrador', 'Sistema')
                    """
                ]
                
                for i, command in enumerate(sql_commands, 1):
                    try:
                        cursor.execute(command)
                        if i == 1:
                            print("✅ Tabela anterior removida (se existia)")
                        elif i == 2:
                            print("✅ Tabela Usuarios criada")
                        elif i == 3:
                            print("✅ Índice CPF criado")
                        elif i == 4:
                            print("✅ Índice Email criado")
                        elif i == 5:
                            print("✅ Índice Usuário criado")
                        elif i == 6:
                            print("✅ Usuário ADMIN inserido")
                    except Exception as e:
                        print(f"⚠️ Aviso no comando {i}: {e}")
                
                conn.commit()
                print("✅ Tabela Usuarios criada com sucesso!")
                return True
                
    except Exception as e:
        print(f"❌ Erro ao criar tabela: {e}")
        return False

def verify_table():
    """Verifica se a tabela foi criada corretamente"""
    try:
        with psycopg.connect(**DB_CONFIG) as conn:
            with conn.cursor() as cursor:
                
                # Verifica se a tabela existe
                cursor.execute("""
                    SELECT COUNT(*) FROM information_schema.tables 
                    WHERE table_name = 'Usuarios'
                """)
                
                if cursor.fetchone()[0] == 0:
                    print("❌ Tabela Usuarios não foi criada")
                    return False
                
                # Verifica estrutura
                cursor.execute("""
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = 'Usuarios' 
                    ORDER BY ordinal_position
                """)
                
                columns = cursor.fetchall()
                print("\n📋 Estrutura da tabela Usuarios:")
                for col in columns:
                    print(f"  - {col[0]}: {col[1]}")
                
                # Verifica dados
                cursor.execute("SELECT COUNT(*) FROM \"Usuarios\"")
                count = cursor.fetchone()[0]
                print(f"\n📊 Total de usuários: {count}")
                
                # Lista usuários
                cursor.execute("SELECT \"Nome\", \"Email\", \"Usuario\", \"Perfil\" FROM \"Usuarios\"")
                users = cursor.fetchall()
                print("\n👥 Usuários criados:")
                for user in users:
                    print(f"  - {user[0]} ({user[1]}) - {user[2]} - {user[3]}")
                
                return True
                
    except Exception as e:
        print(f"❌ Erro ao verificar tabela: {e}")
        return False

def main():
    """Função principal"""
    print("🔧 Criação da Tabela Usuarios - SERVIDOR REMOTO")
    print("=" * 50)
    
    # Testa conexão
    if not test_connection():
        print("❌ Não foi possível conectar ao banco de dados remoto")
        sys.exit(1)
    
    # Cria tabela
    if create_usuarios_table():
        print("\n🔍 Verificando se a tabela foi criada corretamente...")
        verify_table()
        
        print("\n🎉 Tabela Usuarios criada com sucesso!")
        print("\n📋 Próximos passos:")
        print("  1. Execute o script de atualização de autenticação")
        print("  2. Reinicie o servidor backend no Docker remoto")
        print("  3. Teste o login com o usuário ADMIN")
        
        print("\n🔑 Usuário disponível:")
        print("  - base@itfact.com.br / ADMIN / ADMIN")
        
    else:
        print("❌ Falha na criação da tabela")
        sys.exit(1)

if __name__ == "__main__":
    main() 