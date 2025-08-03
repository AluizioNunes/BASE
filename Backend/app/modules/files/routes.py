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

 