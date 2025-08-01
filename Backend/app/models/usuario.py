"""
Modelo SQLAlchemy para a tabela USUARIOS usando psycopg-binary
"""
from sqlalchemy import Column, Integer, String, DateTime, Text, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import declarative_base
from sqlalchemy.ext.hybrid import hybrid_property
from typing import Optional
from ..core.database import Base

class Usuario(Base):
    """Modelo para a tabela USUARIOS usando recursos modernos"""
    __tablename__ = "USUARIOS"
    
    # Colunas da tabela
    IdUsuarios = Column(Integer, primary_key=True, autoincrement=True, comment="Identificador único do usuário")
    Nome = Column(String(300), nullable=False, comment="Nome completo do usuário")
    CPF = Column(String(14), nullable=False, unique=True, comment="CPF do usuário (formato: 000.000.000-00)")
    Funcao = Column(String(300), nullable=False, comment="Função/cargo do usuário na empresa")
    Email = Column(String(400), nullable=False, unique=True, comment="Email do usuário")
    Usuario = Column(String(200), nullable=False, unique=True, comment="Nome de usuário para login")
    Senha = Column(String(200), nullable=False, comment="Senha criptografada do usuário")
    Perfil = Column(String(300), nullable=False, comment="Perfil/permissão do usuário no sistema")
    Cadastrante = Column(String(400), nullable=False, comment="Nome do usuário que cadastrou este registro")
    DataCadastro = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, comment="Data e hora do cadastro")
    
    # Índices para melhorar performance
    __table_args__ = (
        Index('idx_usuarios_cpf', 'CPF'),
        Index('idx_usuarios_email', 'Email'),
        Index('idx_usuarios_usuario', 'Usuario'),
        Index('idx_usuarios_perfil', 'Perfil'),
        Index('idx_usuarios_data_cadastro', 'DataCadastro'),
    )
    
    def __repr__(self):
        return f"<Usuario(id={self.IdUsuarios}, nome='{self.Nome}', email='{self.Email}')>"
    
    def __str__(self):
        return f"{self.Nome} ({self.Email})"
    
    @hybrid_property
    def nome_completo(self) -> str:
        """Retorna o nome completo do usuário"""
        return self.Nome.strip()
    
    @hybrid_property
    def email_normalizado(self) -> str:
        """Retorna o email em lowercase"""
        return self.Email.lower() if self.Email else ""
    
    @hybrid_property
    def cpf_formatado(self) -> str:
        """Retorna o CPF formatado"""
        if not self.CPF:
            return ""
        # Remove caracteres não numéricos
        cpf_limpo = ''.join(filter(str.isdigit, self.CPF))
        # Formata: 000.000.000-00
        if len(cpf_limpo) == 11:
            return f"{cpf_limpo[:3]}.{cpf_limpo[3:6]}.{cpf_limpo[6:9]}-{cpf_limpo[9:]}"
        return self.CPF
    
    def to_dict(self) -> dict:
        """Converte o modelo para dicionário usando recursos modernos"""
        return {
            "id": self.IdUsuarios,
            "nome": self.Nome,
            "cpf": self.CPF,
            "cpf_formatado": self.cpf_formatado,
            "funcao": self.Funcao,
            "email": self.Email,
            "email_normalizado": self.email_normalizado,
            "usuario": self.Usuario,
            "perfil": self.Perfil,
            "cadastrante": self.Cadastrante,
            "data_cadastro": self.DataCadastro.isoformat() if self.DataCadastro else None,
            "nome_completo": self.nome_completo
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Usuario':
        """Cria uma instância do modelo a partir de um dicionário"""
        return cls(
            Nome=data.get("nome", "").strip(),
            CPF=data.get("cpf", "").strip(),
            Funcao=data.get("funcao", "").strip(),
            Email=data.get("email", "").strip().lower(),
            Usuario=data.get("usuario", "").strip(),
            Senha=data.get("senha", ""),
            Perfil=data.get("perfil", "").strip(),
            Cadastrante=data.get("cadastrante", "").strip()
        )
    
    def update_from_dict(self, data: dict) -> None:
        """Atualiza o modelo a partir de um dicionário"""
        if "nome" in data:
            self.Nome = data["nome"].strip()
        if "cpf" in data:
            self.CPF = data["cpf"].strip()
        if "funcao" in data:
            self.Funcao = data["funcao"].strip()
        if "email" in data:
            self.Email = data["email"].strip().lower()
        if "usuario" in data:
            self.Usuario = data["usuario"].strip()
        if "senha" in data:
            self.Senha = data["senha"]
        if "perfil" in data:
            self.Perfil = data["perfil"].strip()
        if "cadastrante" in data:
            self.Cadastrante = data["cadastrante"].strip()
    
    @classmethod
    def create_admin(cls, nome: str, email: str, senha_hash: str) -> 'Usuario':
        """Cria um usuário administrador"""
        return cls(
            Nome=nome,
            CPF="000.000.000-00",  # CPF padrão para admin
            Funcao="Administrador",
            Email=email.lower(),
            Usuario=email.split('@')[0].lower(),
            Senha=senha_hash,
            Perfil="Administrador",
            Cadastrante="Sistema"
        )
    
    def is_admin(self) -> bool:
        """Verifica se o usuário é administrador"""
        return self.Perfil.lower() in ["administrador", "admin", "superuser"]
    
    def is_active(self) -> bool:
        """Verifica se o usuário está ativo (sempre True por enquanto)"""
        return True  # Pode ser expandido para incluir campo de status 