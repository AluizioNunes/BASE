import pytest
import os
import tempfile
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

class TestFiles:
    def test_upload_file_success(self):
        """Testa upload de arquivo com sucesso"""
        # Cria um arquivo temporário para teste
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write("Conteúdo de teste")
            temp_file_path = f.name

        try:
            with open(temp_file_path, 'rb') as f:
                response = client.post(
                    "/api/v1/files/upload",
                    files={"file": ("test.txt", f, "text/plain")}
                )
            
            assert response.status_code == 200
            data = response.json()
            assert "filename" in data
            assert data["filename"] == "test.txt"
        finally:
            # Limpa o arquivo temporário
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)

    def test_upload_file_missing(self):
        """Testa upload sem arquivo"""
        response = client.post("/api/v1/files/upload")
        assert response.status_code == 422

    def test_download_file_not_found(self):
        """Testa download de arquivo inexistente"""
        response = client.get("/api/v1/files/download/arquivo_inexistente.txt")
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data

    def test_download_file_success(self):
        """Testa download de arquivo existente"""
        # Primeiro faz upload de um arquivo
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write("Conteúdo para download")
            temp_file_path = f.name

        try:
            # Upload
            with open(temp_file_path, 'rb') as f:
                upload_response = client.post(
                    "/api/v1/files/upload",
                    files={"file": ("download_test.txt", f, "text/plain")}
                )
            
            assert upload_response.status_code == 200
            
            # Download
            download_response = client.get("/api/v1/files/download/download_test.txt")
            assert download_response.status_code == 200
            assert download_response.headers["content-type"] == "application/octet-stream"
            assert "download_test.txt" in download_response.headers["content-disposition"]
        finally:
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)

    def test_upload_large_file(self):
        """Testa upload de arquivo grande (deve falhar)"""
        # Cria um arquivo grande (mais de 10MB)
        large_content = "x" * (11 * 1024 * 1024)  # 11MB
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write(large_content)
            temp_file_path = f.name

        try:
            with open(temp_file_path, 'rb') as f:
                response = client.post(
                    "/api/v1/files/upload",
                    files={"file": ("large_file.txt", f, "text/plain")}
                )
            
            # Deve falhar devido ao tamanho
            assert response.status_code in [413, 422]  # Payload Too Large ou Validation Error
        finally:
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path) 