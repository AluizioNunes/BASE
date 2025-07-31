# Configuração de Secrets no GitHub para CI/CD

## Secrets Necessários

Para que o pipeline de CI/CD funcione corretamente, você precisa configurar os seguintes secrets no seu repositório GitHub:

### 1. Acessar Configuração de Secrets

1. Vá para seu repositório no GitHub
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Secrets and variables** > **Actions**
4. Clique em **New repository secret**

### 2. Secrets para Docker Hub

#### DOCKER_USERNAME
- **Nome**: `DOCKER_USERNAME`
- **Valor**: Seu nome de usuário do Docker Hub
- **Exemplo**: `meuusuario`

#### DOCKER_PASSWORD
- **Nome**: `DOCKER_PASSWORD`
- **Valor**: Seu token de acesso do Docker Hub (não sua senha)
- **Como obter**:
  1. Acesse [Docker Hub](https://hub.docker.com/)
  2. Vá em **Account Settings** > **Security**
  3. Clique em **New Access Token**
  4. Copie o token gerado

### 3. Secrets para Deploy

#### DEPLOY_SSH_KEY
- **Nome**: `DEPLOY_SSH_KEY`
- **Valor**: Chave SSH privada para acessar o servidor de produção
- **Como gerar**:
  ```bash
  ssh-keygen -t rsa -b 4096 -C "deploy@base.com"
  # Copie o conteúdo do arquivo ~/.ssh/id_rsa
  ```

#### DEPLOY_HOST
- **Nome**: `DEPLOY_HOST`
- **Valor**: IP ou domínio do servidor de produção
- **Exemplo**: `192.168.1.100` ou `meuservidor.com`

#### DEPLOY_USER
- **Nome**: `DEPLOY_USER`
- **Valor**: Usuário SSH para deploy
- **Exemplo**: `ubuntu` ou `root`

### 4. Secrets para OAuth (Opcional)

#### GOOGLE_CLIENT_ID
- **Nome**: `GOOGLE_CLIENT_ID`
- **Valor**: Client ID do Google OAuth
- **Exemplo**: `123456789-abcdef.apps.googleusercontent.com`

#### GOOGLE_CLIENT_SECRET
- **Nome**: `GOOGLE_CLIENT_SECRET`
- **Valor**: Client Secret do Google OAuth
- **Exemplo**: `GOCSPX-abcdefghijklmnop`

#### GITHUB_CLIENT_ID
- **Nome**: `GITHUB_CLIENT_ID`
- **Valor**: Client ID do GitHub OAuth
- **Exemplo**: `abcdef123456789`

#### GITHUB_CLIENT_SECRET
- **Nome**: `GITHUB_CLIENT_SECRET`
- **Valor**: Client Secret do GitHub OAuth
- **Exemplo**: `ghijklmnopqrstuvwxyz123456789`

### 5. Secrets para Monitoramento (Opcional)

#### SENTRY_DSN
- **Nome**: `SENTRY_DSN`
- **Valor**: DSN do Sentry para monitoramento de erros
- **Exemplo**: `https://exemploPublicKey@o0.ingest.sentry.io/0`

#### ELASTIC_APM_SERVER_URL
- **Nome**: `ELASTIC_APM_SERVER_URL`
- **Valor**: URL do servidor Elastic APM
- **Exemplo**: `http://localhost:8200`

#### ELASTIC_APM_SECRET_TOKEN
- **Nome**: `ELASTIC_APM_SECRET_TOKEN`
- **Valor**: Token secreto do Elastic APM
- **Exemplo**: `your_apm_secret_token_here`

## Configuração no Workflow

O workflow já está configurado para usar esses secrets. Exemplo de uso:

```yaml
# .github/workflows/ci.yml
- name: Login to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}

- name: Deploy to production
  run: |
    echo "Deploying to ${{ secrets.DEPLOY_HOST }}"
    # Comandos de deploy usando os secrets
```

## Verificação

### 1. Testar Secrets

Para verificar se os secrets estão configurados corretamente:

1. Vá para **Actions** no seu repositório
2. Execute o workflow manualmente
3. Verifique se não há erros relacionados a secrets

### 2. Logs de Debug

Se houver problemas, você pode adicionar logs de debug (temporariamente):

```yaml
- name: Debug secrets
  run: |
    echo "Docker username: ${{ secrets.DOCKER_USERNAME }}"
    echo "Deploy host: ${{ secrets.DEPLOY_HOST }}"
    # NÃO commite isso em produção!
```

## Segurança

### Boas Práticas

1. **Nunca commite** secrets no código
2. **Use tokens** em vez de senhas quando possível
3. **Rotacione** secrets periodicamente
4. **Monitore** o uso dos secrets
5. **Use variáveis de ambiente** diferentes para cada ambiente

### Permissões

Certifique-se de que o workflow tem as permissões necessárias:

```yaml
permissions:
  contents: read
  packages: write
  actions: read
```

## Troubleshooting

### Erro: "Secret not found"

- Verifique se o nome do secret está correto
- Certifique-se de que o secret foi criado no repositório correto
- Verifique se não há espaços extras no nome

### Erro: "Permission denied"

- Verifique se o token/credencial tem as permissões necessárias
- Para Docker Hub, use um token de acesso em vez da senha
- Para SSH, verifique se a chave pública está no servidor

### Erro: "Invalid credentials"

- Verifique se as credenciais estão corretas
- Teste as credenciais localmente primeiro
- Regenerar tokens se necessário 