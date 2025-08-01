-- Script simples para criar tabela USUARIOS
DROP TABLE IF EXISTS USUARIOS CASCADE;

CREATE TABLE USUARIOS (
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
);

-- Índices básicos
CREATE INDEX idx_usuarios_cpf ON USUARIOS("CPF");
CREATE INDEX idx_usuarios_email ON USUARIOS("Email");
CREATE INDEX idx_usuarios_usuario ON USUARIOS("Usuario");

-- Dados de exemplo
INSERT INTO USUARIOS ("Nome", "CPF", "Funcao", "Email", "Usuario", "Senha", "Perfil", "Cadastrante") VALUES
('Renata F.', '123.456.789-00', 'Administrador', 'renata@email.com', 'renata.admin', 'senha123', 'Administrador', 'Sistema'),
('João Silva', '987.654.321-00', 'Usuário', 'joao@email.com', 'joao.silva', 'senha123', 'Usuário', 'Renata F.'),
('Maria Souza', '456.789.123-00', 'Usuário', 'maria@email.com', 'maria.souza', 'senha123', 'Usuário', 'Renata F.');

-- Verifica se foi criada
SELECT COUNT(*) as total_usuarios FROM USUARIOS; 