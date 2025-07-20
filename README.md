# 🚀 BASE - Template Full-Stack Profissional

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-20.10+-blue.svg)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17.5-blue.svg)](https://www.postgresql.org/)

> **Template completo e profissional** para aplicações web modernas, pronto para ser reutilizado em novos projetos com **zero configuração**.

## ✨ Características

### 🎯 **Frontend (React 19)**
- ⚡ **React 19** com TypeScript
- 🌍 **Internacionalização** (i18n) - PT/EN
- ♿ **Acessibilidade** completa (ARIA, navegação por teclado)
- 📱 **PWA** (Progressive Web App) com service worker
- 🔍 **React Query** para cache e gerenciamento de estado
- 🎨 **Toast notifications** com react-toastify
- 🧪 **Testes** com Jest e React Testing Library
- 📊 **Sentry** para monitoramento de erros
- 🔒 **Autenticação** com JWT em cookies httpOnly

### 🔧 **Backend (FastAPI)**
- ⚡ **FastAPI** com Python 3.11+
- 🗄️ **PostgreSQL 17.5** com Alembic para migrações
- 🔄 **Redis 8.0** para cache
- 📨 **Celery + RabbitMQ** para filas assíncronas
- 📝 **Logs estruturados** com loguru
- 📊 **Prometheus** para métricas
- 🔒 **Autenticação JWT** com cookies seguros
- 📁 **Uploads seguros** de arquivos
- 🛡️ **LGPD/GDPR** compliance
- 🧪 **Testes** com pytest

### 🐳 **DevOps & Infraestrutura**
- 🐳 **Docker Compose** para desenvolvimento e produção
- 🌐 **Traefik 3.4** como reverse proxy com SSL automático
- 📊 **Grafana + Loki** para monitoramento centralizado
- 🔧 **Portainer** para gerenciamento de containers
- 🔄 **CI/CD** com GitHub Actions
- 📦 **Volumes persistentes** padronizados
- 🔒 **SSL/HTTPS** automático com Let's Encrypt

## 🚀 Quick Start

### 1. **Usar como Template**
```bash
# Clique em "Use this template" no GitHub
# Ou clone diretamente:
git clone https://github.com/AluizioNunes/BASE-REACT-FASTAPI.git meu-projeto
cd meu-projeto
```

### 2. **Configurar Variáveis**
```bash
# Copiar arquivos de exemplo
cp portainer.env.example .env
cp stack-test.env .env.local

# Editar as variáveis
nano .env
```

### 3. **Rodar com Docker**
```bash
# Desenvolvimento
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Produção
docker-compose -f docker-compose.prod.yml up --build

# Com Portainer
docker-compose -f docker-compose.portainer.yml up -d
```

### 4. **Acessar a Aplicação**
- 🌐 **Frontend:** http://localhost:3000
- 🔧 **Backend API:** http://localhost:8000/api
- 📊 **Grafana:** http://localhost:3001 (admin/admin123)
- 📝 **Loki:** http://localhost:3100
- 🐳 **Portainer:** http://localhost:9000

## 📁 Estrutura do Projeto

```
BASE/
├── 📁 Backend/                 # API FastAPI
│   ├── 📁 app/
│   │   ├── 📁 core/           # Configurações
│   │   ├── 📁 modules/        # Módulos da aplicação
│   │   └── main.py           # Entry point
│   ├── 📁 tests/             # Testes do backend
│   ├── 📁 migrations/        # Migrações Alembic
│   └── requirements.txt      # Dependências Python
├── 📁 src/                   # Frontend React
│   ├── 📁 components/        # Componentes reutilizáveis
│   ├── 📁 pages/            # Páginas da aplicação
│   ├── 📁 services/         # Serviços de API
│   ├── 📁 context/          # Contextos React
│   ├── 📁 hooks/            # Custom hooks
│   └── 📁 i18n/             # Internacionalização
├── 📁 docs/                 # Documentação completa
├── 📁 scripts/              # Scripts de automação
├── 📁 public/               # Arquivos estáticos
├── docker-compose.yml       # Configuração base
├── docker-compose.dev.yml   # Desenvolvimento
├── docker-compose.prod.yml  # Produção
├── stack-test.yml          # Stack para Portainer
└── README.md               # Este arquivo
```

## 🔧 Configuração

### **Variáveis de Ambiente**

```bash
# Domínio da aplicação
DOMAIN=localhost

# Credenciais do banco
POSTGRES_USER=base_user
POSTGRES_PASSWORD=base_password_123
POSTGRES_DB=base_db

# URLs da aplicação
REACT_APP_API_URL=https://localhost/api
BACKEND_CORS_ORIGINS=https://localhost

# Configurações de debug
DEBUG=True

# Email para SSL
ACME_EMAIL=admin@exemplo.com
```

### **Portas Utilizadas**

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| Frontend | 3000 | React App |
| Backend | 8000 | FastAPI |
| PostgreSQL | 5432 | Banco de dados |
| Redis | 6379 | Cache |
| RabbitMQ | 5672 | Message broker |
| Grafana | 3001 | Monitoramento |
| Loki | 3100 | Logs |
| Portainer | 9000 | Gerenciamento Docker |
| Traefik | 80/443 | Proxy reverso |

## 📊 Monitoramento

### **Grafana**
- **URL:** http://localhost:3001
- **Usuário:** admin
- **Senha:** admin123
- **Dashboards:** Métricas de containers, logs, performance

### **Loki**
- **URL:** http://localhost:3100
- **Funcionalidade:** Centralização de logs
- **Query:** Logs por container, nível, timestamp

### **Prometheus**
- **URL:** http://localhost:8000/metrics
- **Métricas:** Performance da API, requests, erros

## 🧪 Testes

### **Frontend**
```bash
npm test                    # Rodar testes
npm run test:coverage      # Cobertura de testes
npm run test:accessibility # Testes de acessibilidade
```

### **Backend**
```bash
cd Backend
pytest tests/              # Rodar testes
pytest --cov=app tests/    # Cobertura de testes
```

## 🚀 Deploy

### **Desenvolvimento**
```bash
# Hot reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### **Produção**
```bash
# Build otimizado
docker-compose -f docker-compose.prod.yml up --build -d
```

### **Com Portainer**
1. Acesse http://localhost:9000
2. Crie uma nova Stack
3. Cole o conteúdo do `stack-test.yml`
4. Configure as variáveis de ambiente
5. Deploy!

## 📚 Documentação

- 📖 **[Setup](docs/setup.md)** - Configuração inicial
- 🏗️ **[Arquitetura](docs/arquitetura.md)** - Visão geral da arquitetura
- 🚀 **[Deploy](docs/deploy.md)** - Guias de deploy
- 📊 **[Monitoramento](docs/monitoramento.md)** - Configuração de monitoramento
- 🔒 **[Segurança](docs/segurança.md)** - Boas práticas de segurança
- ♿ **[Acessibilidade](docs/acessibilidade.md)** - Padrões de acessibilidade
- 🌍 **[LGPD/GDPR](docs/lgpd_gdpr.md)** - Compliance de dados
- 💾 **[Backup](docs/backup_disaster_recovery.md)** - Estratégias de backup
- 🔐 **[Autenticação](docs/fluxo_autenticacao.md)** - Fluxo de autenticação
- 🐳 **[Portainer](docs/portainer-setup.md)** - Configuração do Portainer

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- [FastAPI](https://fastapi.tiangolo.com/) - Framework web moderno
- [React](https://reactjs.org/) - Biblioteca JavaScript
- [Docker](https://www.docker.com/) - Containerização
- [Traefik](https://traefik.io/) - Reverse proxy
- [Grafana](https://grafana.com/) - Monitoramento

## 📞 Suporte

- 📧 **Email:** [seu-email@exemplo.com]
- 🐛 **Issues:** [GitHub Issues](https://github.com/AluizioNunes/BASE-REACT-FASTAPI/issues)
- 📖 **Documentação:** [docs/](docs/)

---

⭐ **Se este template foi útil, considere dar uma estrela no repositório!**
