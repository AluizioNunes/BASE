# Documentação da API BASE

## Visão Geral

A API BASE é uma API REST moderna construída com FastAPI que fornece funcionalidades de autenticação, gerenciamento de arquivos e tarefas assíncronas.

## Base URL

- **Desenvolvimento**: `http://localhost:8000`
- **Produção**: `https://seu-dominio.com`

## Autenticação

A API utiliza autenticação JWT baseada em cookies HTTP-only para segurança.

### Endpoints de Autenticação

#### Login Tradicional
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "message": "Login realizado com sucesso"
}
```

#### Login OAuth - Google
```http
GET /api/v1/auth/google/login
```

#### Login OAuth - GitHub
```http
GET /api/v1/auth/github/login
```

#### Logout
```http
POST /api/v1/auth/logout
```

#### Perfil do Usuário
```http
GET /api/v1/auth/profile
```

**Resposta:**
```json
{
  "email": "usuario@exemplo.com",
  "name": "Usuário Exemplo"
}
```

## Gerenciamento de Arquivos

### Upload de Arquivo
```http
POST /api/v1/files/upload
Content-Type: multipart/form-data

file: [arquivo]
```

**Resposta:**
```json
{
  "filename": "uuid-gerado.ext",
  "original_name": "documento.pdf",
  "size": 1024000,
  "message": "Arquivo enviado com sucesso"
}
```

### Download de Arquivo
```http
GET /api/v1/files/download/{filename}
```

### Listar Arquivos
```http
GET /api/v1/files/list
```

**Resposta:**
```json
{
  "files": [
    {
      "filename": "uuid-gerado.ext",
      "original_name": "documento.pdf",
      "size": 1024000,
      "uploaded_at": "2024-01-15T10:30:00",
      "content_type": "application/pdf"
    }
  ],
  "total": 1
}
```

### Deletar Arquivo
```http
DELETE /api/v1/files/{filename}
```

## Tarefas Assíncronas

### Processar Dados
```http
POST /api/v1/tasks/process-data
Content-Type: application/json

{
  "dados": {
    "campo1": "valor1",
    "campo2": "valor2"
  }
}
```

### Enviar Email
```http
POST /api/v1/tasks/send-email
Content-Type: application/json

{
  "destinatario": "usuario@exemplo.com",
  "assunto": "Teste",
  "conteudo": "Conteúdo do email"
}
```

## Monitoramento

### Health Check
```http
GET /health
```

**Resposta:**
```json
{
  "status": "healthy",
  "timestamp": 1705312200.123,
  "version": "1.0.0",
  "environment": "production"
}
```

### Readiness Check
```http
GET /ready
```

### Métricas Prometheus
```http
GET /metrics
```

## Códigos de Status

- `200` - Sucesso
- `201` - Criado
- `400` - Requisição inválida
- `401` - Não autenticado
- `403` - Acesso negado
- `404` - Não encontrado
- `422` - Dados inválidos
- `429` - Rate limit excedido
- `500` - Erro interno

## Rate Limiting

A API implementa rate limiting para proteger contra abuso:

- **Login**: 5 tentativas por minuto
- **Upload**: 10 arquivos por hora
- **Geral**: 100 requisições por minuto

## Exemplos de Uso

### JavaScript/TypeScript
```javascript
// Login
const response = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    email: 'usuario@exemplo.com',
    password: 'senha123'
  })
});

// Upload de arquivo
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const uploadResponse = await fetch('/api/v1/files/upload', {
  method: 'POST',
  credentials: 'include',
  body: formData
});
```

### Python
```python
import requests

# Login
response = requests.post('http://localhost:8000/api/v1/auth/login', 
                        json={'email': 'usuario@exemplo.com', 'password': 'senha123'},
                        cookies=session.cookies)

# Upload de arquivo
with open('arquivo.pdf', 'rb') as f:
    files = {'file': f}
    response = requests.post('http://localhost:8000/api/v1/files/upload',
                           files=files,
                           cookies=session.cookies)
```

### cURL
```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@exemplo.com", "password": "senha123"}' \
  -c cookies.txt

# Upload
curl -X POST http://localhost:8000/api/v1/files/upload \
  -F "file=@arquivo.pdf" \
  -b cookies.txt
```

## Limitações

- **Tamanho máximo de arquivo**: 10MB
- **Tipos de arquivo permitidos**: jpg, jpeg, png, gif, pdf, doc, docx, xls, xlsx
- **Token JWT**: Expira em 24 horas
- **Cache**: 1 hora para dados comuns

## Suporte

Para suporte técnico, entre em contato através de:
- Email: suporte@base.com
- Documentação: https://docs.base.com
- GitHub Issues: https://github.com/seu-repo/issues 