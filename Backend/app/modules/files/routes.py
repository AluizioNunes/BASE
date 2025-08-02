from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, Request, status
from fastapi.responses import FileResponse, JSONResponse
from typing import List
import os
import uuid
from datetime import datetime
from ..auth.services import get_current_user
from ...core.config import settings
from ...core.cache import cache_set, cache_get

router = APIRouter()
UPLOAD_DIR = settings.UPLOAD_DIR
os.makedirs(UPLOAD_DIR, exist_ok=True)

def validate_file_extension(filename: str) -> bool:
    """Valida a extensão do arquivo"""
    if not filename:
        return False
    file_ext = os.path.splitext(filename)[1].lower()
    return file_ext in settings.ALLOWED_EXTENSIONS

def validate_file_size(file_size: int) -> bool:
    """Valida o tamanho do arquivo"""
    return file_size <= settings.MAX_FILE_SIZE

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    """
    Upload de arquivo com validações
    """
    # Validações
    if not validate_file_extension(file.filename):
        raise HTTPException(
            status_code=400, 
            detail=f"Tipo de arquivo não permitido. Tipos aceitos: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )
    
    # Lê o arquivo para validar tamanho
    content = await file.read()
    if not validate_file_size(len(content)):
        raise HTTPException(
            status_code=400,
            detail=f"Arquivo muito grande. Tamanho máximo: {settings.MAX_FILE_SIZE // (1024*1024)}MB"
        )
    
    # Gera nome único para o arquivo
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_location = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Salva o arquivo
    with open(file_location, "wb") as f:
        f.write(content)
    
    # Registra no cache
    file_info = {
        "original_name": file.filename,
        "stored_name": unique_filename,
        "size": len(content),
        "uploaded_by": user["email"],
        "uploaded_at": datetime.now().isoformat(),
        "content_type": file.content_type
    }
    
    cache_set(f"file_info_{unique_filename}", file_info, ex=86400)  # 24 horas
    
    return {
        "filename": unique_filename,
        "original_name": file.filename,
        "size": len(content),
        "message": "Arquivo enviado com sucesso"
    }

@router.get("/download/{filename}")
async def download_file(filename: str):
    """
    Download de arquivo
    """
    file_location = os.path.join(UPLOAD_DIR, filename)
    
    if not os.path.exists(file_location):
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")
    
    # Busca informações do arquivo no cache
    file_info = cache_get(f"file_info_{filename}")
    original_name = file_info.get("original_name", filename) if file_info else filename
    
    return FileResponse(
        file_location, 
        media_type="application/octet-stream", 
        filename=original_name
    )

@router.get("/list")
async def list_files(user: dict = Depends(get_current_user)):
    """
    Lista arquivos do usuário
    """
    files = []
    
    for filename in os.listdir(UPLOAD_DIR):
        file_info = cache_get(f"file_info_{filename}")
        if file_info and file_info.get("uploaded_by") == user["email"]:
            files.append({
                "filename": filename,
                "original_name": file_info.get("original_name", filename),
                "size": file_info.get("size", 0),
                "uploaded_at": file_info.get("uploaded_at"),
                "content_type": file_info.get("content_type")
            })
    
    return {"files": files, "total": len(files)}

@router.delete("/{filename}")
async def delete_file(
    filename: str,
    user: dict = Depends(get_current_user)
):
    """
    Remove arquivo
    """
    file_location = os.path.join(UPLOAD_DIR, filename)
    
    if not os.path.exists(file_location):
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")
    
    # Verifica se o usuário é o dono do arquivo
    file_info = cache_get(f"file_info_{filename}")
    if not file_info or file_info.get("uploaded_by") != user["email"]:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    # Remove o arquivo
    os.remove(file_location)
    
    # Remove do cache
    from ...core.cache import cache_delete
    cache_delete(f"file_info_{filename}")
    
    return {"message": "Arquivo removido com sucesso"} 

@router.get('/config', tags=["Configuração"])
def get_config(request: Request):
    # Mock: proteger por autenticação real depois
    if not request.headers.get('x-admin', '') == 'true':
        raise HTTPException(status_code=403, detail='Acesso restrito a administradores')
    env_path = os.path.join(os.path.dirname(__file__), '../../../.env')
    if not os.path.exists(env_path):
        return JSONResponse({})
    with open(env_path, 'r', encoding='utf-8') as f:
        content = f.read()
    config = {}
    for line in content.splitlines():
        if '=' in line:
            k, v = line.split('=', 1)
            config[k.strip()] = v.strip()
    return config

@router.put('/config', tags=["Configuração"])
def put_config(request: Request, data: dict):
    # Mock: proteger por autenticação real depois
    if not request.headers.get('x-admin', '') == 'true':
        raise HTTPException(status_code=403, detail='Acesso restrito a administradores')
    env_path = os.path.join(os.path.dirname(__file__), '../../../.env')
    lines = [f"{k}={v}" for k, v in data.items()]
    with open(env_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    return {"success": True}

@router.post('/create-database', tags=["Configuração"])
def create_database(request: Request, db_config: dict):
    """
    Cria um novo banco de dados dinamicamente
    """
    # Mock: proteger por autenticação real depois
    if not request.headers.get('x-admin', '') == 'true':
        raise HTTPException(status_code=403, detail='Acesso restrito a administradores')
    
    try:
        import psycopg
        from psycopg import sql
        
        # Conectar ao PostgreSQL como superuser
        conn_string = f"postgresql://postgres:postgres@db:5432/postgres"
        
        with psycopg.connect(conn_string) as conn:
            with conn.cursor() as cur:
                # Criar banco de dados
                db_name = db_config.get('DB_NAME', 'BASE')
                db_user = db_config.get('DB_USER', 'BASE')
                db_password = db_config.get('DB_PASSWORD', 'BASE123')
                db_schema = db_config.get('DB_SCHEMA', 'BASE')
                
                # Verificar se o banco já existe
                cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (db_name,))
                if cur.fetchone():
                    return {"message": f"Banco de dados '{db_name}' já existe"}
                
                # Criar banco de dados
                cur.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(db_name)))
                
                # Criar usuário se não existir
                cur.execute("SELECT 1 FROM pg_user WHERE usename = %s", (db_user,))
                if not cur.fetchone():
                    cur.execute(sql.SQL("CREATE USER {} WITH PASSWORD %s").format(sql.Identifier(db_user)), (db_password,))
                
                # Conceder privilégios
                cur.execute(sql.SQL("GRANT ALL PRIVILEGES ON DATABASE {} TO {}").format(
                    sql.Identifier(db_name), sql.Identifier(db_user)))
                
                conn.commit()
        
        # Agora conectar ao novo banco e criar schema/tabelas
        new_conn_string = f"postgresql://{db_user}:{db_password}@db:5432/{db_name}"
        
        with psycopg.connect(new_conn_string) as conn:
            with conn.cursor() as cur:
                # Criar schema
                cur.execute(sql.SQL("CREATE SCHEMA IF NOT EXISTS {}").format(sql.Identifier(db_schema)))
                
                # Criar tabela Usuarios
                cur.execute(sql.SQL("""
                    CREATE TABLE IF NOT EXISTS {}.{} (
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
                    )
                """).format(sql.Identifier(db_schema), sql.Identifier("Usuarios")))
                
                # Inserir usuário ADMIN
                cur.execute(sql.SQL("""
                    INSERT INTO {}.{} ("Usuario", "Senha", "Email", "Nome", "Perfil", "Funcao", "Ativo")
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT ("Usuario") DO NOTHING
                """).format(sql.Identifier(db_schema), sql.Identifier("Usuarios")), (
                    'ADMIN',
                    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5u.Ge',  # ADMIN123
                    'admin@system.com',
                    'Administrador',
                    'Administrador',
                    'Administrador',
                    True
                ))
                
                # Criar índices
                cur.execute(sql.SQL("CREATE INDEX IF NOT EXISTS idx_usuarios_email ON {}.{} (\"Email\")").format(
                    sql.Identifier(db_schema), sql.Identifier("Usuarios")))
                cur.execute(sql.SQL("CREATE INDEX IF NOT EXISTS idx_usuarios_usuario ON {}.{} (\"Usuario\")").format(
                    sql.Identifier(db_schema), sql.Identifier("Usuarios")))
                cur.execute(sql.SQL("CREATE INDEX IF NOT EXISTS idx_usuarios_ativo ON {}.{} (\"Ativo\")").format(
                    sql.Identifier(db_schema), sql.Identifier("Usuarios")))
                
                # Conceder permissões
                cur.execute(sql.SQL("GRANT ALL PRIVILEGES ON SCHEMA {} TO {}").format(
                    sql.Identifier(db_schema), sql.Identifier(db_user)))
                cur.execute(sql.SQL("GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA {} TO {}").format(
                    sql.Identifier(db_schema), sql.Identifier(db_user)))
                cur.execute(sql.SQL("GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA {} TO {}").format(
                    sql.Identifier(db_schema), sql.Identifier(db_user)))
                
                conn.commit()
        
        return {
            "message": f"Banco de dados '{db_name}' criado com sucesso",
            "database": {
                "name": db_name,
                "user": db_user,
                "schema": db_schema
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar banco de dados: {str(e)}") 