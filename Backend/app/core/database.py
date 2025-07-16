from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool  # Adiciona suporte a pool de conexões
from .config import settings

# Configuração do pool de conexões para PostgreSQL
engine = create_engine(
    settings.DATABASE_URL,
    poolclass=QueuePool,  # Usa um pool de conexões
    pool_size=5,          # Número de conexões mantidas no pool
    max_overflow=10,      # Número máximo de conexões além do pool_size
    pool_timeout=30,      # Tempo máximo de espera por uma conexão (segundos)
    pool_pre_ping=True,   # Verifica se a conexão está ativa antes de usá-la
    pool_recycle=3600     # Recicla conexões após 1 hora para evitar timeouts
)

# Sessão do banco de dados
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para os modelos SQLAlchemy
Base = declarative_base()

def get_db():
    """
    Fornece uma sessão do banco de dados.
    
    Uso típico:
    ```python
    db = next(get_db())
    try:
        # Seu código aqui
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
