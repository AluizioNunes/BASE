# Módulo Auth (Autenticação)

Este módulo é responsável por autenticação de usuários.

## Estrutura
```
auth/
├── routes.py   # Endpoints de autenticação
├── services.py # Lógica de autenticação
```

## Endpoints
- `POST /api/v1/auth/login` – Login de usuário
- `POST /api/v1/auth/logout` – Logout de usuário
- `GET /api/v1/auth/profile` – Perfil do usuário autenticado

## Boas práticas
- Nunca armazene senhas em texto puro
- Use JWT via cookie httpOnly para autenticação
- Valide todos os dados recebidos 