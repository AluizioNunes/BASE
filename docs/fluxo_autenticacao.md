# Fluxo de Autenticação

## Passos
1. Usuário envia email e senha para o endpoint `/api/auth/login`
2. Backend valida credenciais
3. Se válido, backend retorna um token JWT
4. Frontend armazena o token (ex: localStorage)
5. Para acessar rotas protegidas, frontend envia o token no header Authorization
6. Backend valida o token em cada requisição

## Exemplo de requisição
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

## Exemplo de uso do token
```http
GET /api/protected
Authorization: Bearer <token>
``` 