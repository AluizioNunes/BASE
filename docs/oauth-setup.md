# Configuração OAuth - Google e GitHub

## Configuração Google OAuth

### 1. Criar Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API do Google+ e Google OAuth2

### 2. Configurar Credenciais OAuth

1. Vá para "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure:
   - **Application type**: Web application
   - **Name**: BASE System
   - **Authorized redirect URIs**:
     - `http://localhost:8000/api/v1/auth/google/callback` (desenvolvimento)
     - `https://seu-dominio.com/api/v1/auth/google/callback` (produção)

### 3. Obter Credenciais

Após criar, você receberá:
- **Client ID**: `123456789-abcdef.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-abcdefghijklmnop`

### 4. Configurar no .env

```env
GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback
```

## Configuração GitHub OAuth

### 1. Criar OAuth App no GitHub

1. Acesse [GitHub Settings](https://github.com/settings/developers)
2. Clique em "New OAuth App"
3. Configure:
   - **Application name**: BASE System
   - **Homepage URL**: `http://localhost:3000` (desenvolvimento)
   - **Authorization callback URL**:
     - `http://localhost:8000/api/v1/auth/github/callback` (desenvolvimento)
     - `https://seu-dominio.com/api/v1/auth/github/callback` (produção)

### 2. Obter Credenciais

Após criar, você receberá:
- **Client ID**: `abcdef123456789`
- **Client Secret**: `ghijklmnopqrstuvwxyz123456789`

### 3. Configurar no .env

```env
GITHUB_CLIENT_ID=abcdef123456789
GITHUB_CLIENT_SECRET=ghijklmnopqrstuvwxyz123456789
GITHUB_REDIRECT_URI=http://localhost:8000/api/v1/auth/github/callback
```

## Testando a Configuração

### 1. Verificar Configuração

```bash
# Teste se as variáveis estão sendo carregadas
cd Backend
python -c "from app.core.config import settings; print(f'Google: {settings.GOOGLE_CLIENT_ID[:10]}...'); print(f'GitHub: {settings.GITHUB_CLIENT_ID[:10]}...')"
```

### 2. Testar Endpoints

```bash
# Teste Google OAuth
curl -X GET "http://localhost:8000/api/v1/auth/google/login"

# Teste GitHub OAuth
curl -X GET "http://localhost:8000/api/v1/auth/github/login"
```

## Troubleshooting

### Erro: "Invalid redirect URI"

- Verifique se as URIs no Google/GitHub correspondem exatamente às do .env
- Certifique-se de que não há espaços extras ou caracteres especiais

### Erro: "Client ID not found"

- Verifique se o Client ID está correto no .env
- Certifique-se de que o projeto/app está ativo

### Erro: "Invalid client secret"

- Verifique se o Client Secret está correto
- Se necessário, gere um novo secret no console

## Segurança

### Boas Práticas

1. **Nunca commite** o arquivo .env no Git
2. **Use secrets** diferentes para desenvolvimento e produção
3. **Rotacione** os secrets periodicamente
4. **Monitore** o uso das APIs OAuth

### Variáveis de Produção

Para produção, configure:

```env
# Produção
GOOGLE_REDIRECT_URI=https://seu-dominio.com/api/v1/auth/google/callback
GITHUB_REDIRECT_URI=https://seu-dominio.com/api/v1/auth/github/callback
PRODUCTION=True
SECURE_COOKIES=True
``` 