# 🔌 Documentação da API

Este documento descreve a API REST do sistema BASE, construída com FastAPI e Python 3.13.5.

## 🎯 Visão Geral

A API BASE é uma API REST moderna que fornece:
- **Autenticação JWT** segura
- **Validação automática** de dados com Pydantic
- **Documentação interativa** (Swagger/OpenAPI)
- **Performance otimizada** com FastAPI
- **Type safety** com Python 3.13.5

## 🏗️ Arquitetura da API

### Stack Tecnológica

- **FastAPI 0.116.1** - Framework web moderno
- **Python 3.13.5** - Linguagem principal
- **SQLAlchemy 2.0.41** - ORM
- **Pydantic 2.11.7** - Validação de dados
- **PostgreSQL 17.5** - Banco de dados
- **Redis 8.0** - Cache
- **RabbitMQ 4.1.2** - Filas de mensagens

### Estrutura da API

```
Backend/app/
├── main.py              # Entry point da aplicação
├── core/                # Configurações e utilitários
│   ├── config.py        # Configurações da aplicação
│   ├── database.py      # Conexão com banco
│   ├── cache.py         # Configuração Redis
│   └── celery_app.py    # Configuração Celery
└── modules/             # Módulos da aplicação
    ├── auth/            # Autenticação e autorização
    │   ├── routes.py    # Rotas de auth
    │   ├── schemas.py   # Schemas Pydantic
    │   └── services.py  # Lógica de negócio
    └── files/           # Upload de arquivos
```

## 🔐 Autenticação

### JWT (JSON Web Tokens)

**Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "João Silva"
  }
}
```

**Usar Token:**
```http
GET /api/users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Configuração JWT

```python
# Backend/app/core/config.py
SECRET_KEY: str = "BASE_SECRET_KEY_CHANGE_IN_PRODUCTION"
ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
```

## 📊 Endpoints Principais

### Autenticação

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/api/auth/login` | Login de usuário | Não |
| `POST` | `/api/auth/logout` | Logout de usuário | Sim |
| `GET` | `/api/auth/me` | Dados do usuário atual | Sim |
| `POST` | `/api/auth/refresh` | Renovar token | Sim |

### Usuários

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `GET` | `/api/users` | Listar usuários | Sim |
| `POST` | `/api/users` | Criar usuário | Sim |
| `GET` | `/api/users/{id}` | Obter usuário | Sim |
| `PUT` | `/api/users/{id}` | Atualizar usuário | Sim |
| `DELETE` | `/api/users/{id}` | Deletar usuário | Sim |

### Arquivos

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/api/files/upload` | Upload de arquivo | Sim |
| `GET` | `/api/files/{id}` | Download de arquivo | Sim |
| `DELETE` | `/api/files/{id}` | Deletar arquivo | Sim |

## 📝 Schemas Pydantic

### Usuário

```python
# Backend/app/modules/auth/schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    password: Optional[str] = None

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
```

### Autenticação

```python
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    user_id: Optional[int] = None
```

## 🔧 Configuração da API

### Variáveis de Ambiente

```env
# Backend/.env
DEBUG=False
DATABASE_URL=postgresql://BASE:BASE@db:5432/BASE
SECRET_KEY=BASE_SECRET_KEY_CHANGE_IN_PRODUCTION
REDIS_HOST=redis
REDIS_PASSWORD=BASE
RABBITMQ_HOST=rabbitmq
RABBITMQ_DEFAULT_USER=BASE
RABBITMQ_DEFAULT_PASS=BASE
BACKEND_CORS_ORIGINS=https://10.10.255.111
```

### Configuração CORS

```python
# Backend/app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://10.10.255.111"],  # Produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📚 Documentação Interativa

### Swagger UI

**Acesso:**
- **Desenvolvimento**: `http://localhost:8000/docs`
- **Produção**: `https://SEU_IP/api/docs`

**Recursos:**
- Teste de endpoints diretamente no navegador
- Documentação automática dos schemas
- Exemplos de requisições e respostas
- Autenticação integrada

### ReDoc

**Acesso:**
- **Desenvolvimento**: `http://localhost:8000/redoc`
- **Produção**: `https://SEU_IP/api/redoc`

**Recursos:**
- Interface mais limpa e organizada
- Documentação em formato de livro
- Melhor para desenvolvedores

## 🚀 Performance

### Otimizações Implementadas

**Async/Await:**
```python
from fastapi import FastAPI
from sqlalchemy.ext.asyncio import AsyncSession

@app.get("/api/users")
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    return result.scalars().all()
```

**Cache Redis:**
```python
# Backend/app/core/cache.py
import redis.asyncio as redis

async def get_cached_user(user_id: int):
    cached = await redis_client.get(f"user:{user_id}")
    if cached:
        return json.loads(cached)
    return None
```

**Connection Pooling:**
```python
# Backend/app/core/database.py
engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True
)
```

## 🔍 Monitoramento

### Health Checks

**Endpoint de Saúde:**
```http
GET /api/health
```

**Resposta:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "rabbitmq": "connected"
  }
}
```

### Métricas

**Endpoint de Métricas:**
```http
GET /api/metrics
```

**Métricas Disponíveis:**
- Requisições por segundo
- Tempo de resposta
- Taxa de erro
- Uso de memória
- Conexões de banco

## 🧪 Testes

### Testes Unitários

```python
# Backend/tests/test_auth.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_login_success():
    response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "testpassword"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_invalid_credentials():
    response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
```

### Testes de Integração

```bash
# Executar todos os testes
cd Backend
pytest

# Executar com cobertura
pytest --cov=app tests/

# Executar testes específicos
pytest tests/test_auth.py::test_login_success
```

## 🚨 Tratamento de Erros

### Estrutura de Erro

```json
{
  "detail": "Erro descritivo",
  "error_code": "VALIDATION_ERROR",
  "timestamp": "2024-01-01T12:00:00Z",
  "path": "/api/users"
}
```

### Códigos de Erro

| Código | Descrição | HTTP Status |
|--------|-----------|-------------|
| `VALIDATION_ERROR` | Dados inválidos | 422 |
| `AUTHENTICATION_ERROR` | Token inválido | 401 |
| `AUTHORIZATION_ERROR` | Sem permissão | 403 |
| `NOT_FOUND` | Recurso não encontrado | 404 |
| `INTERNAL_ERROR` | Erro interno | 500 |

### Middleware de Erro

```python
# Backend/app/core/error_handlers.py
from fastapi import Request, status
from fastapi.responses import JSONResponse

@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "Dados inválidos",
            "error_code": "VALIDATION_ERROR",
            "errors": exc.errors()
        }
    )
```

## 📈 Versionamento

### Estratégia de Versionamento

**URL Versioning:**
```
/api/v1/users
/api/v2/users
```

**Header Versioning:**
```http
GET /api/users
Accept: application/vnd.api.v1+json
```

### Migração de Versões

```python
# Backend/app/api/v1/endpoints/users.py
@router.get("/users")
async def get_users_v1():
    # Versão 1 da API
    pass

# Backend/app/api/v2/endpoints/users.py
@router.get("/users")
async def get_users_v2():
    # Versão 2 da API com mudanças
    pass
```

## 🔧 Deploy

### Docker

```dockerfile
# Backend/Dockerfile
FROM python:3.13.5-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose

```yaml
# docker-compose.prod.yml
backend:
  build:
    context: ./Backend
    dockerfile: Dockerfile
  environment:
    - DATABASE_URL=postgresql://BASE:BASE@db:5432/BASE
    - REDIS_HOST=redis
    - RABBITMQ_HOST=rabbitmq
```

## 📚 Recursos Adicionais

### Documentação Oficial
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Pydantic Documentation](https://pydantic-docs.helpmanual.io/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)

### Exemplos e Tutoriais
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [SQLAlchemy Async](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html)
- [Pydantic Validation](https://pydantic-docs.helpmanual.io/usage/validators/)

---

**BASE - Sistema de Gestão** - API moderna e performática para máxima produtividade. 