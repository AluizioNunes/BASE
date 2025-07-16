# Módulo Auth (Autenticação)

Este módulo é responsável por autenticação de usuários.

## Estrutura
```
auth/
├── routes.py   # Endpoints de autenticação
├── schemas.py  # Modelos Pydantic para login, registro, etc
├── services.py # Lógica de autenticação
├── models.py   # (Opcional) Modelos de usuário
```

## Endpoints
- `POST /api/auth/login` – Login de usuário
- `POST /api/auth/register` – Registro de novo usuário (implementar)

## Exemplo de uso (login)
```json
POST /api/auth/login
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

## Boas práticas
- Nunca armazene senhas em texto puro
- Use JWT ou OAuth2 para autenticação
- Valide todos os dados recebidos 