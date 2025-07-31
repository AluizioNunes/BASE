import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.modules.auth.services import authenticate_user, create_access_token

client = TestClient(app)

class TestAuth:
    def test_root_endpoint(self):
        """Testa o endpoint raiz da API"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "API Base" in data["message"]

    def test_login_success(self):
        """Testa login com credenciais válidas"""
        response = client.post("/api/v1/auth/login", json={
            "email": "usuario@exemplo.com",
            "password": "senha123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "sucesso" in data["message"].lower()

    def test_login_invalid_credentials(self):
        """Testa login com credenciais inválidas"""
        response = client.post("/api/v1/auth/login", json={
            "email": "fake@fake.com",
            "password": "wrong"
        })
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data

    def test_login_missing_fields(self):
        """Testa login com campos obrigatórios ausentes"""
        response = client.post("/api/v1/auth/login", json={
            "email": "usuario@exemplo.com"
        })
        assert response.status_code == 422

    def test_logout(self):
        """Testa logout"""
        response = client.post("/api/v1/auth/logout")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data

    def test_profile_unauthorized(self):
        """Testa acesso ao perfil sem autenticação"""
        response = client.get("/api/v1/auth/profile")
        assert response.status_code == 401

    def test_profile_authorized(self):
        """Testa acesso ao perfil com autenticação"""
        # Primeiro faz login
        login_response = client.post("/api/v1/auth/login", json={
            "email": "usuario@exemplo.com",
            "password": "senha123"
        })
        assert login_response.status_code == 200

        # Depois acessa o perfil
        response = client.get("/api/v1/auth/profile")
        assert response.status_code == 200
        data = response.json()
        assert "email" in data
        assert "name" in data

class TestAuthServices:
    def test_authenticate_user_valid(self):
        """Testa autenticação de usuário válido"""
        user = authenticate_user("usuario@exemplo.com", "senha123")
        assert user is not None
        assert user["email"] == "usuario@exemplo.com"
        assert user["name"] == "Usuário Exemplo"

    def test_authenticate_user_invalid(self):
        """Testa autenticação de usuário inválido"""
        user = authenticate_user("fake@fake.com", "wrong")
        assert user is None

    def test_create_access_token(self):
        """Testa criação de token de acesso"""
        token = create_access_token({"sub": "test@example.com"})
        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 0 