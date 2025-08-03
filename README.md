# TEMPLATE BASE - Sistema de Usuários, Perfis, Permissões e Deploy Docker

Este projeto é um template robusto para sistemas baseados em FastAPI (backend) e React (frontend), pronto para ser customizado em novos projetos.

## Como usar

### Opção 1: Configuração Visual (Recomendado)
1. **Clone o repositório**
2. **Copie o arquivo `Backend/env.example` para `Backend/.env`**
3. **Edite o `.env` com suas configurações**
4. **Rode o sistema:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```
5. **Acesse o sistema:**
   - Frontend: http://<seu-ip>
   - Login: http://<seu-ip>/login
   - Backend: http://<seu-ip>/api/docs

### Opção 2: Configuração Manual
1. **Clone o repositório**
2. **Copie o arquivo `Backend/env.example` para `Backend/.env`**
3. **Edite o `.env` e troque:**
   - `APP_NAME` para o nome do seu sistema (ex: SYSPROG)
   - `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` conforme seu banco
   - `VITE_API_URL` e `BACKEND_CORS_ORIGINS` para o IP/URL do seu servidor
   - Outras variáveis conforme necessário
4. **Rode o deploy com Docker Compose:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```
5. **Acesse o sistema**
   - Frontend: http://<seu-ip>
   - Wizard: http://<seu-ip>/wizard
   - Login: http://<seu-ip>/login
   - Backend: http://<seu-ip>/api/docs

## 🔄 Recriar Banco de Dados

O banco de dados é criado **automaticamente** quando você:

1. **Roda o Docker Compose pela primeira vez** - o script `init-db.sql` executa automaticamente
2. **Usa o Wizard de Setup** - cria o banco dinamicamente conforme a configuração

### **Para recriar do zero:**
```bash
# Parar containers
docker-compose -f docker-compose.prod.yml down

# Remover volume do PostgreSQL
docker volume rm BASE_pgsql_data

# Iniciar containers (banco será criado automaticamente)
docker-compose -f docker-compose.prod.yml up -d
```

### **Via Configurações:**
1. Acesse: http://[IP]/configuracoes (apenas administradores)
2. Configure o banco de dados na aba "Banco de Dados"
3. Salve as configurações
4. O banco será criado automaticamente

## Funcionalidades de Configuração

### Tela de Configurações (Administradores)
- **Acesso via:** Menu do sistema (apenas para administradores)
- **Funcionalidades:**
  - Edição visual de todas as configurações
  - Abas organizadas: Geral, Banco, Redis, RabbitMQ, SMTP
  - Salvar diretamente no backend
  - Upload/download de arquivo `.env`
  - Validações avançadas e feedback visual

### Integração com Backend
- **Endpoints REST:** GET/PUT `/api/v1/files/config`
- **Proteção:** Apenas administradores podem acessar
- **Autenticação:** JWT token obrigatório
- **Persistência:** Salva diretamente no arquivo `.env` do backend

## Customização
- **Todas as referências a "BASE" e IP** estão centralizadas no `.env`.
- **Para criar um novo sistema:** use o Wizard ou edite o `.env` manualmente.
- **O frontend exibe o nome do app** automaticamente.
- **Configurações são salvas em tempo real** no backend.

## Estrutura dos containers
- Traefik (proxy reverso, HTTPS)
- Backend (FastAPI/Uvicorn)
- Frontend (React/Vite)
- Redis, RabbitMQ, PostgreSQL (opcional nos exemplos)

## Variáveis de ambiente principais
Veja `Backend/env.example` para todas as opções.

## Telas prontas
- Usuários, Perfis, Permissões, Login, Dashboard
- **Wizard de Configuração Inicial**
- **Tela de Configurações (Administradores)**
- Menu de Configurações para customização futura

## Para contribuir
- Siga o padrão de variáveis e mantenha o template genérico.
- Use apenas Ant Design, Framer Motion e dependências já aprovadas.

---
