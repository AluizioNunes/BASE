# Fluxo de Autenticação

## Passos
1. Usuário envia email e senha para o endpoint `/api/v1/auth/login`
2. Backend (FastAPI 0.116.1, python-jose 3.5.0) valida credenciais
3. Se válido, backend retorna um cookie httpOnly com JWT
4. Frontend (React 19.1.0 + Vite 7.0.5) **não armazena** o token manualmente; o cookie é enviado automaticamente
5. Para acessar rotas protegidas, frontend faz requisição normalmente (cookie é enviado)
6. Backend valida o cookie JWT em cada requisição protegida (`/api/v1/auth/profile`)
7. Logout: frontend chama `/api/v1/auth/logout`, backend remove o cookie

## Exemplo de requisição de login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

## Exemplo de uso do cookie
```http
GET /api/v1/auth/profile
Cookie: access_token=<token>
```

## Proteção de rotas no frontend
- Use PrivateRoute para proteger páginas
- O estado de autenticação é verificado via `/api/v1/auth/profile` 
- Stack: React 19.1.0, vite-plugin-pwa 1.0.1, shadcn-ui 0.9.5 