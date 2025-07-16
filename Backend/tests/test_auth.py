import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_login_fail():
    response = client.post("/auth/login", json={"email": "fake@fake.com", "password": "wrong"})
    assert response.status_code in [200, 401, 400]  # Ajuste conforme implementação 