# Guia Rápido - Stack BASE no Portainer

## Pré-requisitos

- Portainer já instalado e funcionando
- Docker e Docker Compose disponíveis
- Acesso ao servidor Linux

## Passo a Passo

### 1. Acesse o Portainer
- URL: `http://seu-servidor:9000` (ou porta configurada)
- Faça login com suas credenciais

### 2. Criar Nova Stack

1. **Vá para Stacks**
2. **Clique em "Add Stack"**
3. **Configure:**
   - **Name:** `base-application`
   - **Build method:** `Web editor`
   - **Copy and paste:** Conteúdo do arquivo `stack-test.yml`

### 3. Configurar Variáveis de Ambiente

No editor do stack, adicione as variáveis:

```yaml
# Domínio para teste
DOMAIN=localhost

# Credenciais do banco
POSTGRES_USER=base_user
POSTGRES_PASSWORD=base_password_123
POSTGRES_DB=base_db

# URLs da aplicação
REACT_APP_API_URL=https://localhost/api
BACKEND_CORS_ORIGINS=https://localhost

# Configurações do banco
DATABASE_URL=postgresql://base_user:base_password_123@db:5432/base_db

# Debug ativado para teste
DEBUG=True

# Grafana
GRAFANA_ADMIN_PASSWORD=admin123
```

### 4. Deploy da Stack

1. **Clique em "Deploy the stack"**
2. **Aguarde a criação dos containers**
3. **Monitore os logs em "Containers"**

## Acessos da Aplicação

Após o deploy bem-sucedido:

- **Frontend:** `https://localhost` (ou IP do servidor)
- **Backend API:** `https://localhost/api`
- **Grafana:** `http://localhost:3001` (admin/admin123)
- **Loki:** `http://localhost:3100`

## Monitoramento

### Verificar Status
1. **Vá para Containers**
2. **Verifique se todos estão "Running"**
3. **Clique nos containers para ver logs**

### Logs Importantes
- **base-backend:** Logs da API
- **base-frontend:** Logs do React
- **base-db:** Logs do PostgreSQL
- **base-traefik:** Logs do proxy reverso

## Troubleshooting

### Problemas Comuns

1. **Build falha:**
   - Verifique se os Dockerfiles existem
   - Verifique permissões dos arquivos

2. **Containers não iniciam:**
   - Verifique logs do container
   - Verifique variáveis de ambiente

3. **Acesso negado:**
   - Verifique portas disponíveis
   - Verifique firewall

### Comandos Úteis

```bash
# Verificar status dos containers
docker ps

# Ver logs de um container específico
docker logs base-backend

# Parar a stack
docker-compose -f stack-test.yml down

# Remover volumes (cuidado!)
docker-compose -f stack-test.yml down -v
```

## Próximos Passos

1. **Teste a aplicação**
2. **Configure domínio real**
3. **Ajuste credenciais**
4. **Configure backup**
5. **Configure monitoramento**

## Limpeza

Para remover a stack:
1. **Vá para Stacks**
2. **Clique na stack "base-application"**
3. **Clique em "Remove"**
4. **Confirme a remoção** 