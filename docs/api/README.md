# Documentação da API

## Versionamento
- Todas as rotas públicas usam prefixo `/api/v1/`.

## Upload/Download de Arquivos
- `POST /api/v1/files/upload` – Upload seguro de arquivos
- `GET /api/v1/files/download/{filename}` – Download seguro de arquivos

## Cache
- O backend utiliza Redis 8.0 para cache de dados.
- Exemplos de uso em `app/core/cache.py`.

## Exemplo de upload
```bash
curl -F "file=@/caminho/para/arquivo.txt" http://localhost:8000/api/v1/files/upload
```

## Exemplo de download
```bash
curl -O http://localhost:8000/api/v1/files/download/arquivo.txt
```

## Convenções
- Todas as respostas são em JSON
- Use sempre HTTPS em produção
- Autenticação via JWT (Bearer Token) recomendada

## Exemplos de resposta
```json
{
  "message": "Login realizado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

## Exemplos de uso com Postman
1. Importe a collection do Swagger (`/docs` do backend) no Postman.
2. Configure variáveis de ambiente (ex: token JWT).
3. Teste endpoints autenticados enviando o header `Authorization: Bearer <token>`.

## Swagger
- Acesse `/docs` no backend para documentação interativa e exemplos de requisição/resposta. 