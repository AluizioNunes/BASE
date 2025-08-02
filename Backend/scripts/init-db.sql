-- Script de inicialização do PostgreSQL
-- Este script é executado automaticamente quando o container PostgreSQL é criado pela primeira vez

-- Garantir que a database existe (será substituída pela variável DB_NAME)
-- O PostgreSQL já cria a database automaticamente baseado em POSTGRES_DB
-- Apenas criar o schema se não existir
CREATE SCHEMA IF NOT EXISTS "BASE";

-- Criar tabela Usuarios se não existir
CREATE TABLE IF NOT EXISTS "BASE"."Usuarios" (
    "Id" SERIAL PRIMARY KEY,
    "Usuario" VARCHAR(50) UNIQUE NOT NULL,
    "Senha" VARCHAR(255) NOT NULL,
    "Email" VARCHAR(100) UNIQUE NOT NULL,
    "Nome" VARCHAR(100) NOT NULL,
    "Perfil" VARCHAR(50) DEFAULT 'Usuario',
    "Funcao" VARCHAR(50) DEFAULT 'Usuario',
    "Ativo" BOOLEAN DEFAULT true,
    "DataCriacao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "DataAtualizacao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "MfaEnabled" BOOLEAN DEFAULT false,
    "MfaSecret" VARCHAR(255),
    "RefreshToken" TEXT,
    "LastLogin" TIMESTAMP,
    "LoginAttempts" INTEGER DEFAULT 0,
    "LockedUntil" TIMESTAMP
);

-- Inserir usuário ADMIN se não existir
INSERT INTO "BASE"."Usuarios" ("Usuario", "Senha", "Email", "Nome", "Perfil", "Funcao", "Ativo")
VALUES (
    'ADMIN',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5u.Ge', -- ADMIN123
    'base@itfact.com.br',
    'Administrador',
    'Administrador',
    'Administrador',
    true
) ON CONFLICT ("Usuario") DO NOTHING;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON "BASE"."Usuarios" ("Email");
CREATE INDEX IF NOT EXISTS idx_usuarios_usuario ON "BASE"."Usuarios" ("Usuario");
CREATE INDEX IF NOT EXISTS idx_usuarios_ativo ON "BASE"."Usuarios" ("Ativo");

-- Garantir permissões (usando variáveis do ambiente)
GRANT ALL PRIVILEGES ON SCHEMA "BASE" TO CURRENT_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA "BASE" TO CURRENT_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA "BASE" TO CURRENT_USER; 