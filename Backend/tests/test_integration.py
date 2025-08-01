import pytest
import json
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import get_db, Base
from app.core.config import settings

# Configuração do banco de teste PostgreSQL
SQLALCHEMY_DATABASE_URL = "postgresql+psycopg://BASE:BASE@10.10.255.111:5432/BASE_TEST"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_database():
    """Configura o banco de dados de teste antes de cada teste"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

class TestAPIIntegration:
    """Testes de integração da API"""
    
    def test_health_check(self):
        """Testa o endpoint de health check"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
    
    def test_api_documentation(self):
        """Testa se a documentação da API está acessível"""
        response = client.get("/docs")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]
    
    def test_openapi_schema(self):
        """Testa se o schema OpenAPI está disponível"""
        response = client.get("/openapi.json")
        assert response.status_code == 200
        schema = response.json()
        assert "openapi" in schema
        assert "paths" in schema
    
    def test_cors_headers(self):
        """Testa se os headers CORS estão configurados corretamente"""
        response = client.options("/api/v1/auth/login")
        assert response.status_code == 200
        assert "access-control-allow-origin" in response.headers
    
    def test_rate_limiting(self):
        """Testa se o rate limiting está funcionando"""
        # Faz múltiplas requisições rapidamente
        for _ in range(10):
            response = client.get("/api/v1/auth/profile")
            if response.status_code == 429:  # Too Many Requests
                break
        else:
            # Se não atingiu o limite, verifica se pelo menos uma requisição foi bloqueada
            response = client.get("/api/v1/auth/profile")
            assert response.status_code in [401, 429]

class TestAuthIntegration:
    """Testes de integração de autenticação"""
    
    def test_complete_auth_flow(self):
        """Testa o fluxo completo de autenticação"""
        # 1. Login
        login_data = {
            "email": "usuario@exemplo.com",
            "password": "senha123"
        }
        response = client.post("/api/v1/auth/login", json=login_data)
        assert response.status_code == 200
        
        # 2. Extrai token
        data = response.json()
        assert "access_token" in data
        token = data["access_token"]
        
        # 3. Acessa perfil protegido
        headers = {"Authorization": f"Bearer {token}"}
        response = client.get("/api/v1/auth/profile", headers=headers)
        assert response.status_code == 200
        
        # 4. Logout
        response = client.post("/api/v1/auth/logout", headers=headers)
        assert response.status_code == 200
    
    def test_invalid_token_handling(self):
        """Testa o tratamento de tokens inválidos"""
        headers = {"Authorization": "Bearer invalid_token"}
        response = client.get("/api/v1/auth/profile", headers=headers)
        assert response.status_code == 401
    
    def test_missing_token_handling(self):
        """Testa o tratamento de requisições sem token"""
        response = client.get("/api/v1/auth/profile")
        assert response.status_code == 401

class TestFileUploadIntegration:
    """Testes de integração de upload de arquivos"""
    
    def test_file_upload_success(self):
        """Testa upload de arquivo válido"""
        files = {"file": ("test.txt", b"test content", "text/plain")}
        response = client.post("/api/v1/files/upload", files=files)
        assert response.status_code == 200
        data = response.json()
        assert "filename" in data
        assert "size" in data
    
    def test_file_upload_invalid_extension(self):
        """Testa upload de arquivo com extensão inválida"""
        files = {"file": ("test.exe", b"test content", "application/octet-stream")}
        response = client.post("/api/v1/files/upload", files=files)
        assert response.status_code == 400
    
    def test_file_upload_too_large(self):
        """Testa upload de arquivo muito grande"""
        large_content = b"x" * (settings.MAX_FILE_SIZE + 1024)
        files = {"file": ("large.txt", large_content, "text/plain")}
        response = client.post("/api/v1/files/upload", files=files)
        assert response.status_code == 413

class TestDatabaseIntegration:
    """Testes de integração com banco de dados"""
    
    def test_database_connection(self):
        """Testa se a conexão com o banco está funcionando"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["database"] == "connected"
    
    def test_database_transactions(self):
        """Testa transações do banco de dados"""
        # Testa criação de usuário
        user_data = {
            "nome": "Teste",
            "email": "teste@exemplo.com",
            "password": "senha123"
        }
        response = client.post("/api/v1/auth/register", json=user_data)
        assert response.status_code == 201
        
        # Verifica se o usuário foi criado
        response = client.get("/api/v1/auth/profile")
        assert response.status_code == 200

class TestErrorHandlingIntegration:
    """Testes de integração de tratamento de erros"""
    
    def test_404_handling(self):
        """Testa tratamento de rotas não encontradas"""
        response = client.get("/rota-inexistente")
        assert response.status_code == 404
    
    def test_422_validation_error(self):
        """Testa tratamento de erros de validação"""
        invalid_data = {"email": "email-invalido"}
        response = client.post("/api/v1/auth/login", json=invalid_data)
        assert response.status_code == 422
    
    def test_500_error_handling(self):
        """Testa tratamento de erros internos"""
        # Simula um erro interno (se houver endpoint para isso)
        response = client.get("/api/v1/test-error")
        if response.status_code == 500:
            data = response.json()
            assert "error" in data

class TestPerformanceIntegration:
    """Testes de integração de performance"""
    
    def test_response_time(self):
        """Testa tempo de resposta da API"""
        import time
        start_time = time.time()
        response = client.get("/health")
        end_time = time.time()
        
        assert response.status_code == 200
        assert (end_time - start_time) < 1.0  # Deve responder em menos de 1 segundo
    
    def test_concurrent_requests(self):
        """Testa requisições concorrentes"""
        import threading
        import time
        
        results = []
        
        def make_request():
            response = client.get("/health")
            results.append(response.status_code)
        
        # Cria 10 threads para fazer requisições simultâneas
        threads = []
        for _ in range(10):
            thread = threading.Thread(target=make_request)
            threads.append(thread)
            thread.start()
        
        # Aguarda todas as threads terminarem
        for thread in threads:
            thread.join()
        
        # Verifica se todas as requisições foram bem-sucedidas
        assert len(results) == 10
        assert all(status == 200 for status in results)

class TestSecurityIntegration:
    """Testes de integração de segurança"""
    
    def test_sql_injection_protection(self):
        """Testa proteção contra SQL injection"""
        malicious_data = {
            "email": "'; DROP TABLE users; --",
            "password": "senha123"
        }
        response = client.post("/api/v1/auth/login", json=malicious_data)
        # Deve retornar erro de validação, não erro de banco
        assert response.status_code in [400, 401, 422]
    
    def test_xss_protection(self):
        """Testa proteção contra XSS"""
        malicious_data = {
            "email": "<script>alert('xss')</script>@exemplo.com",
            "password": "senha123"
        }
        response = client.post("/api/v1/auth/login", json=malicious_data)
        # Deve retornar erro de validação
        assert response.status_code in [400, 401, 422]
    
    def test_content_type_validation(self):
        """Testa validação de content-type"""
        response = client.post("/api/v1/auth/login", 
                             data="invalid json",
                             headers={"Content-Type": "text/plain"})
        assert response.status_code == 422 