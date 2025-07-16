from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import os

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_location, "wb") as f:
        f.write(await file.read())
    return {"filename": file.filename}

@router.get("/download/{filename}")
async def download_file(filename: str):
    file_location = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_location):
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")
    return FileResponse(file_location, media_type="application/octet-stream", filename=filename) 