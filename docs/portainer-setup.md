# Configuração do Portainer

## Visão Geral

O Portainer é uma interface web para gerenciar containers Docker. Esta documentação explica como configurar e usar o Portainer para gerenciar a aplicação BASE.

## Instalação

### Opção 1: Portainer Independente

```bash
# Executar o script de configuração
chmod +x scripts/setup-portainer.sh
./scripts/setup-portainer.sh
```

### Opção 2: Via Docker Compose

```bash
# Iniciar apenas o Portainer
docker-compose -f docker-compose.portainer.yml up -d

# Acessar: http://localhost:9000
```

### Opção 3: Integrado com a Aplicação

```bash
# Iniciar toda a aplicação com Portainer
docker-compose -f docker-compose.prod.yml up -d

# Acessar: https://seu-dominio.com/portainer
```

## Primeira Configuração

1. **Acesse o Portainer:**
   - Local: `http://localhost:9000`
   - Produção: `https://seu-dominio.com/portainer`

2. **Crie o usuário admin:**
   - Digite uma senha forte
   - Confirme a senha

3. **Conecte ao Docker:**
   - Selecione "Connect to Docker Socket"
   - Clique em "Connect"

## Gerenciando a Aplicação via Portainer

### 1. Criar Stack

1. No Portainer, vá para **Stacks**
2. Clique em **Add Stack**
3. Configure:
   - **Name:** `base-application`
   - **Build method:** `Web editor`
   - **Copy and paste:** Conteúdo do arquivo `portainer-stack.yml`

### 2. Configurar Variáveis de Ambiente

No editor do stack, configure as variáveis:

```yaml
# Domínio da aplicação
DOMAIN=sua-empresa.com

# Email para SSL
ACME_EMAIL=admin@sua-empresa.com

# Credenciais do banco
POSTGRES_USER=usuario_empresa
POSTGRES_PASSWORD=senha_forte_empresa
POSTGRES_DB=banco_empresa

# URLs da aplicação
REACT_APP_API_URL=https://sua-empresa.com/api
BACKEND_CORS_ORIGINS=https://sua-empresa.com

# Configurações do banco
DATABASE_URL=postgresql://usuario_empresa:senha_forte_empresa@db:5432/banco_empresa
```

### 3. Deploy da Stack

1. Clique em **Deploy the stack**
2. Aguarde a criação dos containers
3. Monitore os logs em **Containers**

## Funcionalidades do Portainer

### Monitoramento
- **Containers:** Status, logs, recursos
- **Images:** Gerenciar imagens Docker
- **Volumes:** Gerenciar volumes persistentes
- **Networks:** Configurar redes Docker

### Logs e Debugging
- Visualizar logs em tempo real
- Executar comandos nos containers
- Acessar terminal dos containers

### Backup e Restore
- Exportar/importar volumes
- Backup de configurações
- Restore de containers

## Segurança

### Configurações Recomendadas

1. **Usuários e Permissões:**
   - Crie usuários específicos para diferentes funções
   - Configure permissões por ambiente

2. **SSL/HTTPS:**
   - Use sempre HTTPS em produção
   - Configure certificados válidos

3. **Backup:**
   - Configure backup automático dos volumes
   - Teste restauração regularmente

### Comandos Úteis

```bash
# Backup do volume do Portainer
docker run --rm -v /var/lib/docker/BASE/volumes/portainer_data:/data -v $(pwd):/backup alpine tar czf /backup/portainer-backup.tar.gz -C /data .

# Restore do volume do Portainer
docker run --rm -v /var/lib/docker/BASE/volumes/portainer_data:/data -v $(pwd):/backup alpine tar xzf /backup/portainer-backup.tar.gz -C /data

# Criar diretórios de volumes padronizados
chmod +x scripts/create-volumes.sh
./scripts/create-volumes.sh
```

## Troubleshooting

### Problemas Comuns

1. **Portainer não inicia:**
   ```bash
   # Verificar logs
   docker-compose -f docker-compose.portainer.yml logs
   
   # Verificar permissões do Docker socket
   ls -la /var/run/docker.sock
   ```

2. **Acesso negado:**
   ```bash
   # Adicionar usuário ao grupo docker
   sudo usermod -aG docker $USER
   ```

3. **Stack não deploya:**
   - Verificar sintaxe do YAML
   - Verificar variáveis de ambiente
   - Verificar disponibilidade de portas

### Logs Importantes

```bash
# Logs do Portainer
docker logs portainer

# Logs da aplicação
docker-compose -f docker-compose.prod.yml logs -f

# Status dos containers
docker-compose -f docker-compose.prod.yml ps
```

## Integração com CI/CD

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Portainer
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Portainer
        run: |
          curl -X POST \
            -H "X-API-Key: ${{ secrets.PORTAINER_API_KEY }}" \
            -H "Content-Type: application/json" \
            -d @portainer-stack.yml \
            "http://seu-servidor:9000/api/stacks"
```

## Próximos Passos

1. **Configurar monitoramento avançado**
2. **Implementar backup automático**
3. **Configurar alertas**
4. **Implementar CI/CD**
5. **Configurar múltiplos ambientes**

## Suporte

- [Documentação oficial do Portainer](https://docs.portainer.io/)
- [Comunidade Portainer](https://community.portainer.io/)
- [GitHub Issues](https://github.com/portainer/portainer/issues) 