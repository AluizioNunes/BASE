# Changelog

## [2025-08-02] - Reorganização das Rotas do Traefik

### 🌐 **Novas Rotas Implementadas**

#### **Frontend (React)**
- **Página Principal:** `http://[IP]/` ou `https://[IP]/`
- **Wizard de Setup:** `http://[IP]/wizard` ou `https://[IP]/wizard`
- **Login:** `http://[IP]/login` ou `https://[IP]/login`
- **Outras Páginas:** `http://[IP]/[outras-rotas]`

#### **Backend (FastAPI)**
- **API:** `http://[IP]/api` ou `https://[IP]/api`
- **Documentação Swagger:** `http://[IP]/api/docs`
- **Health Check:** `http://[IP]/api/health`

#### **Ferramentas de Administração**
- **Grafana (Monitoramento):** `http://[IP]/grafana` ou `https://[IP]/grafana`
- **Traefik Dashboard:** `http://[IP]/traefik` ou `https://[IP]/traefik`
- **RabbitMQ Management:** `http://[IP]/rabbitmq` ou `https://[IP]/rabbitmq`

### 🔧 **Mudanças Técnicas**

#### **Docker Compose (`docker-compose.prod.yml`)**
- ✅ Reorganizadas as rotas do frontend com prioridades específicas
- ✅ Criadas rotas separadas para `/wizard` e `/login`
- ✅ Mantida compatibilidade com rota `/setup` (redireciona para `/wizard`)
- ✅ Ajustadas prioridades das rotas para melhor organização

#### **Frontend (`src/App.tsx`)**
- ✅ Adicionada rota `/wizard` para o SetupWizard
- ✅ Mantida rota `/setup` para compatibilidade
- ✅ Removida lógica de auto-redirecionamento para wizard
- ✅ Simplificado o carregamento do nome da aplicação

#### **Documentação**
- ✅ Criado `docs/rotas-traefik.md` com documentação completa
- ✅ Atualizado `CHANGELOG.md` com as mudanças

### 📋 **Prioridades das Rotas**
1. **Prioridade 100:** Traefik Dashboard
2. **Prioridade 50:** Grafana
3. **Prioridade 20:** Wizard e Login
4. **Prioridade 10:** Frontend Principal e Backend API
5. **Prioridade 1:** Outras páginas do Frontend (fallback)

### 🚀 **Como Usar**

#### **Acesso Principal**
```
http://10.10.255.111/
```

#### **Setup Inicial**
```
http://10.10.255.111/wizard
```

#### **Login**
```
http://10.10.255.111/login
```

#### **API**
```
http://10.10.255.111/api/health
http://10.10.255.111/api/docs
```

#### **Monitoramento**
```
http://10.10.255.111/grafana
http://10.10.255.111/traefik
http://10.10.255.111/rabbitmq
```

---

## [2025-08-02] - Correção de Variáveis de Ambiente

### 🔧 **Problemas Resolvidos**
- ✅ Removidos arquivos `.env` conflitantes (`stack-test.env`, `env.prod.example`)
- ✅ Mantido apenas `Backend/.env` como fonte única de configuração
- ✅ Corrigida string de conexão hardcoded no módulo de autenticação
- ✅ Adicionados endpoints `/health` e `/api/health` no backend
- ✅ Criado script de teste de conexão (`testar_conexao_simples.py`)

### 📁 **Estrutura de Arquivos**
- ✅ **Único arquivo `.env`:** `Backend/.env`
- ✅ **Exemplo:** `Backend/env.example`
- ✅ **Script de teste:** `Backend/scripts/testar_conexao_simples.py`

---

## [2025-08-02] - Transformação em Template

### 🎯 **Objetivo**
Transformar o projeto BASE em um template reutilizável para futuros projetos.

### 🔧 **Mudanças Implementadas**
- ✅ Centralização de configurações em variáveis de ambiente
- ✅ Criação de wizard de setup inicial
- ✅ Interface de configurações no frontend
- ✅ API para gerenciamento de configurações
- ✅ Documentação completa para uso como template

### 📋 **Como Usar o Template**
1. Clone o repositório
2. Copie `Backend/env.example` para `Backend/.env`
3. Edite o `.env` com suas configurações
4. Execute `docker-compose -f docker-compose.prod.yml up -d`
5. Acesse `http://[IP]/wizard` para configuração inicial 