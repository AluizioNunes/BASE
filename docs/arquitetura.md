# 🏗️ Arquitetura do Sistema BASE

Este documento descreve a arquitetura técnica do sistema BASE, incluindo componentes, tecnologias e padrões utilizados.

## 🎯 Visão Geral

O BASE é um sistema de gestão empresarial fullstack moderno, construído com arquitetura de microserviços containerizados, seguindo princípios de DevOps e observabilidade.

## 🏛️ Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                        │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTPS
┌─────────────────────▼───────────────────────────────────────┐
│                    TRAEFIK (Proxy Reverso)                  │
│  • SSL/TLS Automático (Let's Encrypt)                      │
│  • Load Balancing                                           │
│  • Rate Limiting                                            │
│  • Basic Auth                                               │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    APLICAÇÃO                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   FRONTEND      │  │    BACKEND      │  │  MONITORING  │ │
│  │  (React + Vite) │  │   (FastAPI)     │  │ (Grafana)    │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    INFRAESTRUTURA                           │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │  PostgreSQL  │  │    Redis     │  │    RabbitMQ     │   │
│  │   (Database) │  │   (Cache)    │  │   (Message Q)   │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 🧩 Componentes Principais

### Frontend (React + Vite)

**Tecnologias:**
- **React 19.1.0** - Framework principal
- **Vite 7.0.5** - Build tool moderno (substitui CRA)
- **TypeScript** - Type safety
- **Ant Design 5.26.6** - UI components
- **ECharts 5.6.0** - Gráficos interativos
- **Framer Motion 12.23.6** - Animações
- **React Router 7.7.0** - Navegação
- **Node.js latest** - Runtime

**Estrutura:**
```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (Button, Card, etc.)
│   ├── Sidebar.tsx     # Menu lateral
│   ├── Navbar.tsx      # Barra superior
│   └── PrivateRoute.tsx # Proteção de rotas
├── pages/              # Páginas da aplicação
│   ├── Home.tsx        # Dashboard principal
│   ├── Usuario.tsx     # Gestão de usuários
│   ├── Perfil.tsx      # Perfil do usuário
│   └── Permissao.tsx   # Gestão de permissões
├── hooks/              # Custom hooks
│   └── useAuth.ts      # Hook de autenticação
├── context/            # Contextos React
│   └── AuthContext.tsx # Contexto de autenticação
├── services/           # Integração com APIs
│   ├── api.ts          # Cliente HTTP
│   └── sentry.ts       # Error tracking
├── styles/             # Estilos globais
├── utils/              # Utilitários
│   └── cn.ts           # Class name utility
└── i18n/               # Internacionalização
    ├── index.ts        # Configuração
    ├── pt.json         # Português
    └── en.json         # Inglês
```

### Backend (FastAPI + Python 3.13.5)

**Tecnologias:**
- **Python 3.13.5** - Linguagem principal
- **FastAPI 0.116.1** - Framework web
- **SQLAlchemy 2.0.41** - ORM
- **Pydantic 2.11.7** - Validação de dados
- **PostgreSQL 17.5** - Banco de dados
- **Redis 8.0** - Cache
- **RabbitMQ 4.1.2** - Filas de mensagens
- **Alembic** - Migrações de banco

**Estrutura:**
```
Backend/
├── app/
│   ├── core/           # Configurações e utilitários
│   │   ├── config.py   # Configurações da aplicação
│   │   ├── database.py # Conexão com banco
│   │   ├── cache.py    # Configuração Redis
│   │   └── celery_app.py # Configuração Celery
│   ├── modules/        # Módulos da aplicação
│   │   ├── auth/       # Autenticação e autorização
│   │   │   ├── routes.py    # Rotas de auth
│   │   │   ├── schemas.py   # Schemas Pydantic
│   │   │   └── services.py  # Lógica de negócio
│   │   └── files/      # Upload de arquivos
│   └── main.py         # Entry point da aplicação
├── migrations/         # Migrações Alembic
├── tests/              # Testes automatizados
├── uploads/            # Arquivos enviados
└── requirements.txt    # Dependências Python
```

### Infraestrutura (Docker + Traefik)

**Tecnologias:**
- **Docker & Docker Compose** - Containerização
- **Traefik v3.4** - Proxy reverso
- **Grafana latest** - Dashboards e métricas
- **Loki latest** - Agregação de logs
- **Portainer** - Gerenciamento de containers

**Serviços:**
```
docker-compose.prod.yml
├── traefik/            # Proxy reverso e SSL
├── frontend/           # Aplicação React
├── backend/            # API FastAPI
├── db/                 # PostgreSQL
├── redis/              # Cache
├── rabbitmq/           # Filas de mensagens
├── grafana/            # Monitoramento
└── loki/               # Logs centralizados
```

## 🔄 Fluxo de Dados

### Autenticação
1. Usuário faz login no frontend
2. Frontend envia credenciais para `/api/auth/login`
3. Backend valida credenciais e retorna JWT
4. Frontend armazena token e inclui em requisições
5. Backend valida token em cada requisição protegida

### Requisições API
1. Frontend faz requisição para API
2. Traefik roteia para backend
3. Backend processa e consulta banco/cache
4. Resposta retorna pelo mesmo caminho
5. Frontend atualiza interface

### Monitoramento
1. Logs são enviados para Loki
2. Métricas são coletadas pelo Traefik
3. Grafana consome dados do Loki e Traefik
4. Dashboards mostram performance e erros

## 🛡️ Segurança

### Camadas de Segurança
1. **SSL/TLS** - Criptografia em trânsito
2. **JWT** - Autenticação stateless
3. **CORS** - Controle de origem
4. **Rate Limiting** - Proteção contra ataques
5. **Basic Auth** - Proteção do Traefik
6. **Volumes** - Permissões específicas por serviço

### Configurações de Segurança
```yaml
# Traefik
- SSL automático com Let's Encrypt
- Rate limiting configurado
- Basic auth para dashboard

# Backend
- CORS configurado adequadamente
- JWT com expiração
- Validação de dados com Pydantic

# Volumes
- Permissões específicas por UID
- Isolamento de dados
```

## 📊 Observabilidade

### Métricas
- **Traefik**: Requisições, latência, erros
- **PostgreSQL**: Conexões, queries, performance
- **Redis**: Hit rate, memória, comandos
- **Aplicação**: Endpoints, tempo de resposta

### Logs
- **Loki**: Centralização de todos os logs
- **Estrutura**: JSON com metadados
- **Retenção**: Configurável por ambiente
- **Busca**: Interface web integrada

### Dashboards
- **Grafana**: Visualização de métricas e logs
- **Templates**: Dashboards pré-configurados
- **Alertas**: Notificações automáticas
- **Customização**: Dashboards específicos

## 🚀 Deploy e CI/CD

### Estratégias de Deploy
1. **Script Wrapper** - Verificações completas
2. **Init Containers** - Preparação automática
3. **Profiles** - Deploy flexível
4. **Manual** - Controle total

### Hooks de Inicialização
```bash
# Verificações automáticas
- Docker e dependências
- Espaço em disco e memória
- Portas disponíveis
- Permissões de volumes
- Arquivos necessários
```

### Ambientes
- **Desenvolvimento**: Hot-reload, debug ativo
- **Staging**: Testes de integração
- **Produção**: Otimizado, monitorado

## 🔧 Configurações

### Variáveis de Ambiente
```env
# Backend
DEBUG=False
DATABASE_URL=postgresql://user:pass@host:port/db
SECRET_KEY=chave_secreta_aqui
REDIS_HOST=redis
RABBITMQ_HOST=rabbitmq

# Frontend
VITE_API_URL=https://api.exemplo.com
```

### Volumes Persistentes
```
/var/lib/docker/BASE/volumes/
├── grafana_data/      # Dashboards e configurações
├── loki_data/         # Logs centralizados
├── postgres_data/     # Banco de dados
├── redis_data/        # Cache persistente
├── rabbitmq_data/     # Filas de mensagens
├── uploads_data/      # Arquivos enviados
└── traefik_data/      # Certificados SSL
```

## 📈 Escalabilidade

### Estratégias
1. **Horizontal**: Múltiplas instâncias
2. **Vertical**: Mais recursos por instância
3. **Cache**: Redis para performance
4. **Filas**: RabbitMQ para tarefas assíncronas

### Monitoramento
- **Health Checks**: Verificação automática
- **Auto-scaling**: Baseado em métricas
- **Load Balancing**: Distribuição de carga
- **Circuit Breaker**: Proteção contra falhas

## 🔄 Manutenção

### Backup
- **Automático**: Scripts cron
- **Incremental**: Apenas mudanças
- **Teste**: Restauração regular
- **Retenção**: Política definida

### Atualizações
- **Rolling**: Sem downtime
- **Blue-Green**: Deploy paralelo
- **Canary**: Teste gradual
- **Rollback**: Reversão rápida

---

**BASE - Sistema de Gestão** - Arquitetura moderna para máxima confiabilidade e performance. 