from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
from .config import settings

# Configuração do pool de conexões para PostgreSQL usando psycopg-binary
engine = create_engine(
    settings.DATABASE_URL,
    poolclass=QueuePool,  # Usa um pool de conexões
    pool_size=5,          # Número de conexões mantidas no pool
    max_overflow=10,      # Número máximo de conexões além do pool_size
    pool_timeout=30,      # Tempo máximo de espera por uma conexão (segundos)
    pool_pre_ping=True,   # Verifica se a conexão está ativa antes de usá-la
    pool_recycle=3600,    # Recicla conexões após 1 hora para evitar timeouts
    # Configurações específicas para psycopg-binary
    connect_args={
        "connect_timeout": 10,
        "application_name": "BASE_APP"
    }
)

# Sessão do banco de dados
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para os modelos SQLAlchemy
Base = declarative_base()

def get_db():
    """
    Fornece uma sessão do banco de dados usando psycopg-binary.
    
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
    ```
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Função para testar conexão direta com psycopg-binary
def test_connection():
    """
    Testa conexão direta com PostgreSQL usando psycopg-binary
    """
    try:
        import psycopg
        # Converte a URL do SQLAlchemy para parâmetros do psycopg3
        from urllib.parse import urlparse
        parsed = urlparse(settings.DATABASE_URL)
        
        config = {
            'host': parsed.hostname or 'localhost',
            'port': parsed.port or 5432,
            'dbname': parsed.path.lstrip('/') or 'BASE',
            'user': parsed.username or 'BASE',
            'password': parsed.password or 'BASE'
        }
        
        conn = psycopg.connect(**config)
        with conn.cursor() as cursor:
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            conn.close()
            return True, version[0] if version else "PostgreSQL"
    except Exception as e:
        return False, str(e)
