-- ========================================
-- SCRIPT: Criar Tabela USUARIOS
-- DESCRIÇÃO: Cria a tabela USUARIOS no PostgreSQL
-- AUTOR: Sistema BASE
-- DATA: $(date)
-- ========================================

-- Verifica se a tabela já existe e remove se necessário
DROP TABLE IF EXISTS USUARIOS CASCADE;

-- Cria a tabela USUARIOS
CREATE TABLE USUARIOS (
    "IdUsuarios" SERIAL PRIMARY KEY,
    "Nome" CHARACTER VARYING(300) NOT NULL,
    "CPF" CHARACTER VARYING(14) UNIQUE NOT NULL,
    "Funcao" CHARACTER VARYING(300) NOT NULL,
    "Email" CHARACTER VARYING(400) UNIQUE NOT NULL,
    "Usuario" CHARACTER VARYING(200) UNIQUE NOT NULL,
    "Senha" CHARACTER VARYING(200) NOT NULL,
    "Perfil" CHARACTER VARYING(300) NOT NULL,
    "Cadastrante" CHARACTER VARYING(400) NOT NULL,
    "DataCadastro" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Cria índices para melhorar performance
CREATE INDEX idx_usuarios_cpf ON USUARIOS("CPF");
CREATE INDEX idx_usuarios_email ON USUARIOS("Email");
CREATE INDEX idx_usuarios_usuario ON USUARIOS("Usuario");
CREATE INDEX idx_usuarios_perfil ON USUARIOS("Perfil");
CREATE INDEX idx_usuarios_data_cadastro ON USUARIOS("DataCadastro");

-- Adiciona comentários na tabela e colunas
COMMENT ON TABLE USUARIOS IS 'Tabela de usuários do sistema BASE';
COMMENT ON COLUMN USUARIOS."IdUsuarios" IS 'Identificador único do usuário (chave primária)';
COMMENT ON COLUMN USUARIOS."Nome" IS 'Nome completo do usuário';
COMMENT ON COLUMN USUARIOS."CPF" IS 'CPF do usuário (formato: 000.000.000-00)';
COMMENT ON COLUMN USUARIOS."Funcao" IS 'Função/cargo do usuário na empresa';
COMMENT ON COLUMN USUARIOS."Email" IS 'Email do usuário (deve ser único)';
COMMENT ON COLUMN USUARIOS."Usuario" IS 'Nome de usuário para login (deve ser único)';
COMMENT ON COLUMN USUARIOS."Senha" IS 'Senha criptografada do usuário';
COMMENT ON COLUMN USUARIOS."Perfil" IS 'Perfil/permissão do usuário no sistema';
COMMENT ON COLUMN USUARIOS."Cadastrante" IS 'Nome do usuário que cadastrou este registro';
COMMENT ON COLUMN USUARIOS."DataCadastro" IS 'Data e hora do cadastro do usuário';

-- Cria trigger para atualizar DataCadastro automaticamente
CREATE OR REPLACE FUNCTION update_data_cadastro()
RETURNS TRIGGER AS $$
BEGIN
    NEW."DataCadastro" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_data_cadastro
    BEFORE UPDATE ON USUARIOS
    FOR EACH ROW
    EXECUTE FUNCTION update_data_cadastro();

-- Insere dados de exemplo (opcional)
INSERT INTO USUARIOS ("Nome", "CPF", "Funcao", "Email", "Usuario", "Senha", "Perfil", "Cadastrante") VALUES
('Renata F.', '123.456.789-00', 'Administrador', 'renata@email.com', 'renata.admin', '$2b$12$iv6nZxw0Qnnt6Ut8eJQGj.eCHz49H5sBst/3oPyUm317QFI6nsyYG', 'Administrador', 'Sistema'),
('João Silva', '987.654.321-00', 'Usuário', 'joao@email.com', 'joao.silva', '$2b$12$iv6nZxw0Qnnt6Ut8eJQGj.eCHz49H5sBst/3oPyUm317QFI6nsyYG', 'Usuário', 'Renata F.'),
('Maria Souza', '456.789.123-00', 'Usuário', 'maria@email.com', 'maria.souza', '$2b$12$iv6nZxw0Qnnt6Ut8eJQGj.eCHz49H5sBst/3oPyUm317QFI6nsyYG', 'Usuário', 'Renata F.');

-- Verifica se a tabela foi criada corretamente
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'USUARIOS' 
ORDER BY ordinal_position;

-- Mostra a estrutura da tabela
\d USUARIOS;

-- Confirma a criação
SELECT 'Tabela USUARIOS criada com sucesso!' as status; 