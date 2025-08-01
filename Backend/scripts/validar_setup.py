#!/usr/bin/env python3
"""
Script para validar o setup completo com psycopg-binary
"""
import os
import sys
import psycopg
from psycopg.rows import dict_row

def validar_imports():
    """Valida se todos os imports necessários funcionam"""
    print("🔍 Validando imports...")
    
    try:
        import psycopg
        print("✅ psycopg-binary importado com sucesso")
        
        from psycopg.rows import dict_row
        print("✅ dict_row importado com sucesso")
        
        return True
    except ImportError as e:
        print(f"❌ Erro ao importar: {e}")
        return False

def validar_conexao():
    """Valida a conexão com o banco"""
    print("\n🔌 Validando conexão com PostgreSQL...")
    
    try:
        config = {
            'host': os.getenv('DBHOST', '10.10.255.111'),  # Servidor Docker
            'port': os.getenv('DBPORT', '5432'),
            'dbname': os.getenv('DBNAME', 'BASE'),  # psycopg3 usa 'dbname'
            'user': os.getenv('DBUSER', 'BASE'),
            'password': os.getenv('DBPASSWORD', 'BASE')
        }
        
        conn = psycopg.connect(**config)
        print("✅ Conexão com PostgreSQL estabelecida")
        
        # Testa query simples
        with conn.cursor() as cursor:
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"✅ PostgreSQL versão: {version[0]}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Erro na conexão: {e}")
        return False

def validar_tabela_usuarios():
    """Valida se a tabela USUARIOS existe e está correta"""
    print("\n📋 Validando tabela USUARIOS...")
    
    try:
        config = {
            'host': os.getenv('DBHOST', '10.10.255.111'),  # Servidor Docker
            'port': os.getenv('DBPORT', '5432'),
            'dbname': os.getenv('DBNAME', 'BASE'),  # psycopg3 usa 'dbname'
            'user': os.getenv('DBUSER', 'BASE'),
            'password': os.getenv('DBPASSWORD', 'BASE')
        }
        
        conn = psycopg.connect(**config)
        
        with conn.cursor(row_factory=dict_row) as cursor:
            # Verifica se a tabela existe
            cursor.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE LOWER(table_name) = LOWER('USUARIOS')
                );
            """)
            
            existe = cursor.fetchone()['exists']
            
            if not existe:
                print("❌ Tabela USUARIOS não encontrada")
                return False
            
            print("✅ Tabela USUARIOS encontrada")
            
            # Verifica estrutura
            cursor.execute("""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns 
                WHERE table_name = 'USUARIOS' 
                ORDER BY ordinal_position;
            """)
            
            colunas = cursor.fetchall()
            print(f"✅ {len(colunas)} colunas encontradas:")
            
            for coluna in colunas:
                print(f"   - {coluna['column_name']}: {coluna['data_type']}")
            
            # Verifica dados
            cursor.execute("SELECT COUNT(*) as total FROM USUARIOS;")
            count = cursor.fetchone()['total']
            print(f"✅ {count} registros encontrados")
            
            if count > 0:
                cursor.execute("SELECT \"Nome\", \"Email\", \"Perfil\" FROM USUARIOS LIMIT 3;")
                usuarios = cursor.fetchall()
                print("✅ Dados de exemplo:")
                for usuario in usuarios:
                    print(f"   - {usuario['Nome']} ({usuario['Email']}) - {usuario['Perfil']}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Erro ao validar tabela: {e}")
        return False

def validar_modelo_sqlalchemy():
    """Valida se o modelo SQLAlchemy funciona"""
    print("\n🏗️ Validando modelo SQLAlchemy...")
    
    try:
        # Adiciona o diretório do app ao path
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
        
        from app.models.usuario import Usuario
        print("✅ Modelo Usuario importado com sucesso")
        
        # Testa criação de instância
        usuario = Usuario(
            Nome="Usuário Teste",
            CPF="111.222.333-44",
            Funcao="Teste",
            Email="teste@email.com",
            Usuario="teste",
            Senha="senha_hash",
            Perfil="Usuário",
            Cadastrante="Script"
        )
        
        print("✅ Instância do modelo criada com sucesso")
        print(f"   - Nome: {usuario.nome_completo}")
        print(f"   - Email: {usuario.email_normalizado}")
        print(f"   - CPF: {usuario.cpf_formatado}")
        print(f"   - É admin: {usuario.is_admin()}")
        
        # Testa conversão para dict
        usuario_dict = usuario.to_dict()
        print("✅ Conversão para dicionário funcionando")
        print(f"   - Keys: {list(usuario_dict.keys())}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao validar modelo: {e}")
        return False

def validar_configuracao():
    """Valida a configuração do ambiente"""
    print("\n⚙️ Validando configuração do ambiente...")
    
    config_vars = [
        'DBHOST', 'DBPORT', 'DBNAME', 'DBUSER', 'DBPASSWORD'
    ]
    
    todas_configuradas = True
    
    for var in config_vars:
        valor = os.getenv(var)
        if valor:
            print(f"✅ {var}: {valor}")
        else:
            print(f"⚠️ {var}: não configurado (usando padrão)")
            todas_configuradas = False
    
    return todas_configuradas

def main():
    """Função principal"""
    print("🚀 Validando setup completo com psycopg-binary...")
    print("=" * 70)
    
    resultados = []
    
    # Validações
    resultados.append(("Imports", validar_imports()))
    resultados.append(("Configuração", validar_configuracao()))
    resultados.append(("Conexão PostgreSQL", validar_conexao()))
    resultados.append(("Tabela USUARIOS", validar_tabela_usuarios()))
    resultados.append(("Modelo SQLAlchemy", validar_modelo_sqlalchemy()))
    
    # Resumo
    print("\n📊 Resumo da Validação:")
    print("-" * 50)
    
    sucessos = 0
    total = len(resultados)
    
    for nome, sucesso in resultados:
        status = "✅ PASSOU" if sucesso else "❌ FALHOU"
        print(f"{nome:<25} {status}")
        if sucesso:
            sucessos += 1
    
    print("-" * 50)
    print(f"Total: {sucessos}/{total} validações passaram")
    
    if sucessos == total:
        print("\n🎉 Setup completo validado com sucesso!")
        print("✅ psycopg-binary está funcionando perfeitamente")
        print("✅ Tabela USUARIOS está pronta para uso")
        print("✅ Modelo SQLAlchemy está configurado")
        return True
    else:
        print(f"\n⚠️ {total - sucessos} validação(ões) falharam")
        print("🔧 Verifique os erros acima e corrija antes de continuar")
        return False

if __name__ == "__main__":
    sucesso = main()
    sys.exit(0 if sucesso else 1) 