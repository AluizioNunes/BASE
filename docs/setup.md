# 🛠️ Guia de Setup

Este guia te ajudará a configurar o ambiente de desenvolvimento para o projeto BASE.

## 📋 Pré-requisitos

- **Python 3.13.5** (versão específica)
- **Node.js latest** (versão mais recente)
- **Docker** e **Docker Compose**
- **Git**

## 🐍 Configuração do Python

### Instalar Python 3.13.5

#### Ubuntu/Debian
```bash
# Adicionar repositório deadsnakes
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
sudo apt install python3.13 python3.13-venv python3.13-pip

# Verificar instalação
python3.13 --version
```

#### macOS
```bash
# Usando Homebrew
brew install python@3.13

# Verificar instalação
python3.13 --version
```

#### Windows
```bash
# Baixar do site oficial: https://www.python.org/downloads/
# Ou usar Chocolatey
choco install python --version=3.13.5
```

### Configurar Ambiente Virtual

```bash
# Navegar para o diretório do backend
cd Backend

# Criar ambiente virtual
python3.13 -m venv venv

# Ativar ambiente virtual
# Linux/macOS:
source venv/bin/activate

# Windows:
.\venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt
```

## 🟢 Configuração do Node.js

### Instalar Node.js Latest

#### Ubuntu/Debian
```bash
# Usando NodeSource
curl -fsSL https://deb.nodesource.com/setup_latest.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

#### macOS
```bash
# Usando Homebrew
brew install node

# Verificar instalação
node --version
npm --version
```

#### Windows
```bash
# Baixar do site oficial: https://nodejs.org/
# Ou usar Chocolatey
choco install nodejs
```

### Configurar Frontend

```bash
# Navegar para o diretório raiz
cd ..

# Instalar dependências
npm install

# Verificar instalação
npm run dev
```

## 🐳 Configuração do Docker

### Instalar Docker

#### Ubuntu/Debian
```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Reiniciar para aplicar permissões
sudo reboot
```

#### macOS
```bash
# Instalar Docker Desktop
brew install --cask docker
```

#### Windows
```bash
# Baixar Docker Desktop: https://www.docker.com/products/docker-desktop
```

### Verificar Instalação

```bash
# Verificar Docker
docker --version
docker-compose --version

# Testar Docker
docker run hello-world
```

## 🚀 Setup Automatizado

### Para Desenvolvimento Local

```bash
# Clonar repositório
git clone https://github.com/AluizioNunes/BASE.git
cd BASE

# Setup automático (Linux/macOS)
chmod +x scripts/setup-new-server.sh
./scripts/setup-new-server.sh
```

### Para Produção

```bash
# Setup completo de servidor
curl -O https://raw.githubusercontent.com/AluizioNunes/BASE/main/scripts/setup-new-server.sh
chmod +x setup-new-server.sh
sudo ./setup-new-server.sh
```

## 🛠️ Configuração do Ambiente

### Variáveis de Ambiente

#### Backend (.env)
```bash
# Criar arquivo .env no diretório Backend
cd Backend
cp .env.example .env

# Editar variáveis
nano .env
```

Exemplo de configuração:
```env
DEBUG=True
BACKEND_CORS_ORIGINS=http://localhost:3000
DATABASE_URL=postgresql://BASE:BASE@localhost:5432/BASE
SECRET_KEY=sua_chave_secreta_aqui
```

#### Frontend (.env)
```bash
# Criar arquivo .env no diretório raiz
cp .env.example .env

# Editar variáveis
nano .env
```

Exemplo de configuração:
```env
VITE_API_URL=http://localhost:8000/api
```

## 🏃‍♂️ Executando a Aplicação

### Desenvolvimento Local

#### Opção 1: Script Automatizado
```bash
# Executar backend e frontend em paralelo
chmod +x scripts/dev.sh
./scripts/dev.sh
```

#### Opção 2: Manual

**Backend:**
```bash
cd Backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
# Em outro terminal
npm run dev
```

#### Opção 3: Docker Compose
```bash
# Desenvolvimento com hot-reload
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### Produção

```bash
# Deploy completo com verificações
chmod +x scripts/start-production.sh
sudo ./scripts/start-production.sh
```

## 🧪 Testes

### Backend
```bash
cd Backend
source venv/bin/activate
pytest
```

### Frontend
```bash
npm run test
```

### Cobertura de Testes
```bash
# Backend
cd Backend
pytest --cov=app tests/

# Frontend
npm run test:coverage
```

## 🔧 Ferramentas de Desenvolvimento

### Linting e Formatação

#### Backend (Python)
```bash
cd Backend
source venv/bin/activate

# Instalar ferramentas
pip install black flake8 isort

# Formatação
black app/
isort app/

# Linting
flake8 app/
```

#### Frontend (TypeScript)
```bash
# Linting
npm run lint

# Formatação
npm run format

# Type checking
npm run type-check
```

### Git Hooks

```bash
# Instalar pre-commit
pip install pre-commit

# Configurar hooks
pre-commit install
```

## 📊 Monitoramento Local

### Logs
```bash
# Backend logs
cd Backend
tail -f logs/app.log

# Docker logs
docker compose logs -f [serviço]
```

### Métricas
- **Grafana**: http://localhost:3000 (se rodando com Docker)
- **Traefik**: http://localhost:8080 (dashboard)

## 🚨 Troubleshooting

### Problemas Comuns

#### Python
```bash
# Erro: python3.13 não encontrado
sudo apt update
sudo apt install python3.13

# Erro: pip não encontrado
python3.13 -m ensurepip --upgrade
```

#### Node.js
```bash
# Erro: node não encontrado
curl -fsSL https://deb.nodesource.com/setup_latest.x | sudo -E bash -
sudo apt-get install -y nodejs

# Erro: npm não encontrado
sudo apt-get install -y npm
```

#### Docker
```bash
# Erro: permissão negada
sudo usermod -aG docker $USER
sudo reboot

# Erro: Docker não está rodando
sudo systemctl start docker
sudo systemctl enable docker
```

### Verificações

```bash
# Verificar versões
python3.13 --version
node --version
npm --version
docker --version
docker-compose --version

# Verificar portas
sudo ss -tlnp | grep :8000  # Backend
sudo ss -tlnp | grep :3000  # Frontend
sudo ss -tlnp | grep :5173  # Vite dev server
```

## 📚 Próximos Passos

1. **Configurar IDE**: VS Code com extensões Python e TypeScript
2. **Configurar Git**: SSH keys e configurações
3. **Configurar Banco**: PostgreSQL local ou Docker
4. **Configurar Redis**: Para cache e sessões
5. **Configurar RabbitMQ**: Para filas assíncronas

## 🔗 Links Úteis

- [Documentação Python 3.13](https://docs.python.org/3.13/)
- [Documentação Node.js](https://nodejs.org/docs/)
- [Documentação Docker](https://docs.docker.com/)
- [Documentação FastAPI](https://fastapi.tiangolo.com/)
- [Documentação Vite](https://vitejs.dev/)
- [Documentação React](https://react.dev/)

---

**Dica**: Use os scripts automatizados sempre que possível para garantir consistência! 