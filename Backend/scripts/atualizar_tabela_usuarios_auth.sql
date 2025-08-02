-- Script para atualizar tabela USUARIOS e criar tabelas de auditoria
-- Execute este script para adicionar as novas funcionalidades de autenticação

-- 1. Verificar se a tabela USUARIOS existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'USUARIOS') THEN
        RAISE EXCEPTION 'Tabela USUARIOS não encontrada. Execute primeiro o script de criação da tabela.';
    END IF;
END $$;

-- 2. Adicionar coluna MFAEnabled à tabela USUARIOS
ALTER TABLE USUARIOS ADD COLUMN IF NOT EXISTS "MFAEnabled" BOOLEAN DEFAULT FALSE;

-- 3. Adicionar coluna LastLogin à tabela USUARIOS
ALTER TABLE USUARIOS ADD COLUMN IF NOT EXISTS "LastLogin" TIMESTAMP;

-- 4. Adicionar coluna PasswordChangedAt à tabela USUARIOS
ALTER TABLE USUARIOS ADD COLUMN IF NOT EXISTS "PasswordChangedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 5. Adicionar coluna FailedLoginAttempts à tabela USUARIOS
ALTER TABLE USUARIOS ADD COLUMN IF NOT EXISTS "FailedLoginAttempts" INTEGER DEFAULT 0;

-- 6. Adicionar coluna AccountLockedUntil à tabela USUARIOS
ALTER TABLE USUARIOS ADD COLUMN IF NOT EXISTS "AccountLockedUntil" TIMESTAMP;

-- 7. Criar tabela de auditoria de login
CREATE TABLE IF NOT EXISTS LOGIN_AUDIT (
    "Id" SERIAL PRIMARY KEY,
    "Email" VARCHAR(400) NOT NULL,
    "Success" BOOLEAN NOT NULL,
    "IPAddress" VARCHAR(45),
    "UserAgent" TEXT,
    "Timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "SessionId" VARCHAR(100),
    "LoginMethod" VARCHAR(20) DEFAULT 'password' -- password, oauth_google, oauth_github
);

-- 8. Criar tabela de tokens de reset de senha
CREATE TABLE IF NOT EXISTS PASSWORD_RESET_TOKENS (
    "Id" SERIAL PRIMARY KEY,
    "Email" VARCHAR(400) NOT NULL,
    "Token" VARCHAR(255) UNIQUE NOT NULL,
    "ExpiresAt" TIMESTAMP NOT NULL,
    "Used" BOOLEAN DEFAULT FALSE,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Criar tabela de sessões ativas
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
    FOREIGN KEY ("UserId") REFERENCES USUARIOS("IdUsuarios") ON DELETE CASCADE
);

-- 10. Criar tabela de códigos MFA
CREATE TABLE IF NOT EXISTS MFA_CODES (
    "Id" SERIAL PRIMARY KEY,
    "UserId" INTEGER NOT NULL,
    "Code" VARCHAR(6) NOT NULL,
    "Type" VARCHAR(20) DEFAULT 'login', -- login, setup
    "ExpiresAt" TIMESTAMP NOT NULL,
    "Used" BOOLEAN DEFAULT FALSE,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("UserId") REFERENCES USUARIOS("IdUsuarios") ON DELETE CASCADE
);

-- 11. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_login_audit_email ON LOGIN_AUDIT("Email");
CREATE INDEX IF NOT EXISTS idx_login_audit_timestamp ON LOGIN_AUDIT("Timestamp");
CREATE INDEX IF NOT EXISTS idx_login_audit_success ON LOGIN_AUDIT("Success");

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON PASSWORD_RESET_TOKENS("Email");
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON PASSWORD_RESET_TOKENS("Token");
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires ON PASSWORD_RESET_TOKENS("ExpiresAt");

CREATE INDEX IF NOT EXISTS idx_active_sessions_user_id ON ACTIVE_SESSIONS("UserId");
CREATE INDEX IF NOT EXISTS idx_active_sessions_session_id ON ACTIVE_SESSIONS("SessionId");
CREATE INDEX IF NOT EXISTS idx_active_sessions_expires ON ACTIVE_SESSIONS("ExpiresAt");

CREATE INDEX IF NOT EXISTS idx_mfa_codes_user_id ON MFA_CODES("UserId");
CREATE INDEX IF NOT EXISTS idx_mfa_codes_expires ON MFA_CODES("ExpiresAt");

-- 12. Criar função para limpar dados antigos
CREATE OR REPLACE FUNCTION cleanup_old_auth_data()
RETURNS void AS $$
BEGIN
    -- Remove tokens de reset expirados
    DELETE FROM PASSWORD_RESET_TOKENS 
    WHERE "ExpiresAt" < CURRENT_TIMESTAMP OR "Used" = TRUE;
    
    -- Remove sessões expiradas
    DELETE FROM ACTIVE_SESSIONS 
    WHERE "ExpiresAt" < CURRENT_TIMESTAMP OR "IsActive" = FALSE;
    
    -- Remove códigos MFA expirados
    DELETE FROM MFA_CODES 
    WHERE "ExpiresAt" < CURRENT_TIMESTAMP OR "Used" = TRUE;
    
    -- Remove auditoria antiga (mais de 90 dias)
    DELETE FROM LOGIN_AUDIT 
    WHERE "Timestamp" < CURRENT_TIMESTAMP - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- 13. Criar função para atualizar último login
CREATE OR REPLACE FUNCTION update_last_login(user_email VARCHAR)
RETURNS void AS $$
BEGIN
    UPDATE USUARIOS 
    SET "LastLogin" = CURRENT_TIMESTAMP,
        "FailedLoginAttempts" = 0,
        "AccountLockedUntil" = NULL
    WHERE "Email" = user_email;
END;
$$ LANGUAGE plpgsql;

-- 14. Criar função para incrementar tentativas falhadas
CREATE OR REPLACE FUNCTION increment_failed_attempts(user_email VARCHAR)
RETURNS void AS $$
BEGIN
    UPDATE USUARIOS 
    SET "FailedLoginAttempts" = "FailedLoginAttempts" + 1,
        "AccountLockedUntil" = CASE 
            WHEN "FailedLoginAttempts" >= 4 THEN CURRENT_TIMESTAMP + INTERVAL '15 minutes'
            ELSE "AccountLockedUntil"
        END
    WHERE "Email" = user_email;
END;
$$ LANGUAGE plpgsql;

-- 15. Verificar se as alterações foram aplicadas
SELECT 
    'USUARIOS' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'USUARIOS' 
ORDER BY ordinal_position;

SELECT 
    'LOGIN_AUDIT' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'LOGIN_AUDIT' 
ORDER BY ordinal_position;

SELECT 
    'PASSWORD_RESET_TOKENS' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'PASSWORD_RESET_TOKENS' 
ORDER BY ordinal_position;

SELECT 
    'ACTIVE_SESSIONS' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'ACTIVE_SESSIONS' 
ORDER BY ordinal_position;

SELECT 
    'MFA_CODES' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'MFA_CODES' 
ORDER BY ordinal_position; 