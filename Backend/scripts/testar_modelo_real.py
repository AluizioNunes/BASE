#!/usr/bin/env python3
"""
Testa o modelo SQLAlchemy com a tabela real
"""
import sys
import os
import psycopg
from psycopg.rows import dict_row

def main():
    """Função principal"""
    print("🚀 Testando modelo SQLAlchemy com tabela real...")
    
    # Adiciona o diretório do app ao path
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
    
    try:
        # Importa o modelo
        from app.models.usuario import Usuario
        print("✅ Modelo importado com sucesso")
        
        # Conecta ao banco
        config = {
            'host': '10.10.255.111',
            'port': 5432,
            'dbname': 'BASE',
            'user': 'BASE',
            'password': 'BASE'
        }
        
        conn = psycopg.connect(**config)
        print("✅ Conectado ao banco")
        
        # Testa consulta com SQLAlchemy
        from sqlalchemy import create_engine, text
        
        engine = create_engine('postgresql+psycopg://BASE:BASE@10.10.255.111:5432/BASE')
        
        with engine.connect() as sqlalchemy_conn:
            # Consulta todos os usuários
            result = sqlalchemy_conn.execute(text("SELECT * FROM USUARIOS;"))
            usuarios = result.fetchall()
            
            print(f"✅ {len(usuarios)} usuários encontrados:")
            for usuario in usuarios:
                print(f"   - ID: {usuario[0]}, Nome: {usuario[1]}, Email: {usuario[4]}")
            
            # Testa consulta específica
            result = sqlalchemy_conn.execute(text("SELECT * FROM USUARIOS WHERE \"Perfil\" = 'Administrador';"))
            admins = result.fetchall()
            print(f"✅ {len(admins)} administradores encontrados")
        
        # Testa criação de novo usuário
        print("\n🔨 Testando criação de usuário...")
        novo_usuario = Usuario(
            Nome="Teste SQLAlchemy",
            CPF="999.888.777-66",
            Funcao="Desenvolvedor",
            Email="teste@sqlalchemy.com",
            Usuario="teste.sqlalchemy",
            Senha="senha_hash",
            Perfil="Usuário",
            Cadastrante="Script"
        )
        
        print("✅ Usuário criado no modelo:")
        print(f"   - Nome: {novo_usuario.nome_completo}")
        print(f"   - Email: {novo_usuario.email_normalizado}")
        print(f"   - CPF: {novo_usuario.cpf_formatado}")
        print(f"   - É admin: {novo_usuario.is_admin()}")
        
        # Testa conversão para dict
        usuario_dict = novo_usuario.to_dict()
        print("✅ Conversão para dicionário:")
        for key, value in usuario_dict.items():
            print(f"   - {key}: {value}")
        
        conn.close()
        print("\n🎉 Teste do modelo SQLAlchemy concluído com sucesso!")
        return True
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    sucesso = main()
    exit(0 if sucesso else 1) 