-- Script de inicialização do PostgreSQL
-- Este script é executado automaticamente quando o container PostgreSQL é criado pela primeira vez

-- Script de inicialização do PostgreSQL
-- Este script é executado automaticamente quando o container PostgreSQL é criado pela primeira vez

-- O PostgreSQL já cria a database automaticamente baseado em POSTGRES_DB
-- Agora vamos criar o schema usando a variável POSTGRES_SCHEMA
-- Se POSTGRES_SCHEMA não estiver definido, usa 'BASE' como padrão
DO $$
BEGIN
    -- Criar schema se não existir (usando variável de ambiente ou padrão)
    EXECUTE 'CREATE SCHEMA IF NOT EXISTS "' || COALESCE(current_setting('POSTGRES_SCHEMA', true), 'BASE') || '"';
END $$;

-- Criar tabela Usuarios se não existir
DO $$
DECLARE
    schema_name TEXT := COALESCE(current_setting('POSTGRES_SCHEMA', true), 'BASE');
BEGIN
    EXECUTE format('CREATE TABLE IF NOT EXISTS "%s"."Usuarios" (
        "Id" SERIAL PRIMARY KEY,
        "Usuario" VARCHAR(50) UNIQUE NOT NULL,
        "Senha" VARCHAR(255) NOT NULL,
        "Email" VARCHAR(100) UNIQUE NOT NULL,
        "Nome" VARCHAR(100) NOT NULL,
        "Perfil" VARCHAR(50) DEFAULT ''Usuario'',
        "Funcao" VARCHAR(50) DEFAULT ''Usuario'',
        "Ativo" BOOLEAN DEFAULT true,
        "DataCriacao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "DataAtualizacao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "MfaEnabled" BOOLEAN DEFAULT false,
        "MfaSecret" VARCHAR(255),
        "RefreshToken" TEXT,
        "LastLogin" TIMESTAMP,
        "LoginAttempts" INTEGER DEFAULT 0,
        "LockedUntil" TIMESTAMP
    )', schema_name);
END $$;

-- Inserir usuário ADMIN se não existir
DO $$
DECLARE
    schema_name TEXT := COALESCE(current_setting('POSTGRES_SCHEMA', true), 'BASE');
BEGIN
    EXECUTE format('INSERT INTO "%s"."Usuarios" ("Usuario", "Senha", "Email", "Nome", "Perfil", "Funcao", "Ativo")
    VALUES (
        ''ADMIN'',
        ''$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5u.Ge'', -- ADMIN123
        ''base@itfact.com.br'',
        ''Administrador'',
        ''Administrador'',
        ''Administrador'',
        true
    ) ON CONFLICT ("Usuario") DO NOTHING', schema_name);
END $$;

-- Criar índices para melhor performance
DO $$
DECLARE
    schema_name TEXT := COALESCE(current_setting('POSTGRES_SCHEMA', true), 'BASE');
BEGIN
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_usuarios_email ON "%s"."Usuarios" ("Email")', schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_usuarios_usuario ON "%s"."Usuarios" ("Usuario")', schema_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_usuarios_ativo ON "%s"."Usuarios" ("Ativo")', schema_name);
END $$;

-- Garantir permissões (usando variáveis do ambiente)
DO $$
DECLARE
    schema_name TEXT := COALESCE(current_setting('POSTGRES_SCHEMA', true), 'BASE');
BEGIN
    EXECUTE format('GRANT ALL PRIVILEGES ON SCHEMA "%s" TO CURRENT_USER', schema_name);
    EXECUTE format('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA "%s" TO CURRENT_USER', schema_name);
    EXECUTE format('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA "%s" TO CURRENT_USER', schema_name);
END $$; 