# BASE - Sistema de Gestão Fullstack

Sistema completo de gestão empresarial com arquitetura moderna, containerizada e pronta para produção.

## 🚀 Principais Recursos

### Frontend (React + Vite)
- **Dashboard interativo** com gráficos ECharts em tempo real
- **Animações fluidas** com Framer Motion
- **Interface responsiva** com Ant Design
- **PWA** (Progressive Web App) habilitado
- **TypeScript** para type safety
- **Hot reload** com Vite para desenvolvimento rápido

### Backend (FastAPI + Python 3.13.5)
- **API REST** moderna e performática
- **Autenticação JWT** segura
- **Banco PostgreSQL** com SQLAlchemy
- **Cache Redis** para performance
- **Filas RabbitMQ** para tarefas assíncronas
- **Documentação automática** (Swagger/OpenAPI)

### Infraestrutura
- **Docker** para containerização
- **Traefik** como proxy reverso com SSL automático
- **Grafana + Loki** para monitoramento e logs
- **Portainer** para gerenciamento de containers
- **Deploy automatizado** com scripts de verificação

## 🛠️ Stack Tecnológica

### Frontend
- **React 19.1.0** + **Vite 7.0.5** (build tool moderno)
- **TypeScript** para type safety
- **Ant Design 5.26.6** para UI components
- **ECharts 5.6.0** para gráficos interativos
- **Framer Motion 12.23.6** para animações
- **React Router 7.7.0** para navegação
- **Node.js latest** (versão mais recente)

### Backend
- **Python 3.13.5** (versão específica)
- **FastAPI 0.116.1** para API REST
- **SQLAlchemy 2.0.41** para ORM
- **Pydantic 2.11.7** para validação
- **PostgreSQL 17.5** para banco de dados
- **Redis 8.0** para cache
- **RabbitMQ 4.1.2** para filas

### Infraestrutura
- **Docker & Docker Compose** para containerização
- **Traefik v3.4** para proxy reverso e SSL
- **Grafana latest** para dashboards
- **Loki latest** para logs centralizados

## 📁 Estrutura do Projeto

```
BASE/
├── Backend/                 # Backend FastAPI
│   ├── app/                # Código principal
│   │   ├── core/           # Configurações, database, cache
│   │   ├── modules/        # Módulos da aplicação
│   │   └── main.py         # Entry point
│   ├── migrations/         # Alembic migrations
│   ├── tests/              # Testes automatizados
│   ├── uploads/            # Upload de arquivos
│   └── requirements.txt    # Dependências Python
├── src/                    # Frontend React + Vite
│   ├── components/         # Componentes reutilizáveis
│   │   └── ui/            # Componentes base (Button, Card, etc.)
│   ├── pages/             # Páginas da aplicação
│   ├── hooks/             # Custom hooks
│   ├── context/           # Contextos React
│   ├── services/          # Integração com APIs
│   ├── styles/            # Estilos globais
│   └── utils/             # Utilitários
├── scripts/               # Scripts de deploy e automação
│   ├── start-production.sh        # Deploy com verificações
│   ├── setup-new-server.sh        # Setup de novo servidor
│   ├── deploy-production.sh       # Deploy automatizado
│   └── deploy-with-hooks.sh       # Demonstração de hooks
├── docs/                  # Documentação completa
├── docker-compose.yml     # Desenvolvimento
├── docker-compose.prod.yml # Produção
├── docker-compose.prod-with-init.yml # Com init containers
├── docker-compose.prod-extensions.yml # Com profiles
└── Dockerfile             # Frontend container
```

## 🚀 Deploy Rápido

### Opção 1: Script Automatizado (Recomendado)
```bash
# Setup inicial do servidor
curl -O https://raw.githubusercontent.com/AluizioNunes/BASE/main/scripts/setup-new-server.sh
chmod +x setup-new-server.sh
sudo ./setup-new-server.sh

# Deploy da aplicação
git clone https://github.com/AluizioNunes/BASE.git
cd BASE
chmod +x scripts/start-production.sh
sudo ./scripts/start-production.sh
```

### Opção 2: Deploy com Hooks de Inicialização
```bash
# Com init containers (sempre executa verificações)
docker compose -f docker-compose.prod-with-init.yml up -d

# Com profiles (opcional)
docker compose --profile init -f docker-compose.prod-extensions.yml up -d

# Deploy normal
docker compose -f docker-compose.prod.yml up -d
```

### Opção 3: Deploy Manual
```bash
# Preparar volumes e permissões
sudo mkdir -p /var/lib/docker/BASE/volumes/{grafana_data,loki_data,postgres_data,redis_data,rabbitmq_data,uploads_data,traefik_data}
sudo chown -R 472:472 /var/lib/docker/BASE/volumes/grafana_data
sudo chown -R 1000:1000 /var/lib/docker/BASE/volumes/loki_data
sudo chown -R 999:999 /var/lib/docker/BASE/volumes/{postgres_data,redis_data,rabbitmq_data}
sudo chmod -R 755 /var/lib/docker/BASE/volumes/

# Subir containers
docker compose -f docker-compose.prod.yml up -d --build
```

## 🌐 URLs de Acesso

Após o deploy bem-sucedido:
- **Frontend**: `https://SEU_IP/`
- **Backend API**: `https://SEU_IP/api/`
- **Grafana**: `https://SEU_IP/grafana/` (admin/BASE)
- **Loki**: `https://SEU_IP/loki/`
- **Traefik Dashboard**: `https://SEU_IP/traefik/`
- **Portainer**: `http://SEU_IP:8000/`

## 🛠️ Desenvolvimento Local

### Frontend
```bash
npm install
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run preview      # Preview build
npm run test         # Testes
```

### Backend
```bash
cd Backend
python3.13 -m venv venv
source venv/bin/activate  # Linux/macOS
# ou .\venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Docker Compose (Desenvolvimento)
```bash
docker compose -f docker-compose.yml up -d
```

## 📊 Monitoramento e Logs

- **Grafana**: Dashboards de métricas e performance
- **Loki**: Centralização e busca de logs
- **Traefik**: Métricas de proxy e SSL
- **Health Checks**: Verificação automática de saúde dos serviços

## 🔒 Segurança

- **SSL/TLS** automático com Let's Encrypt
- **Autenticação JWT** segura
- **CORS** configurado adequadamente
- **Firewall** configurado automaticamente
- **Volumes** com permissões específicas por serviço

## 📚 Documentação Detalhada

Veja a pasta `docs/` para documentação completa:
- [Guia de Deploy](docs/deploy-guide.md) - Deploy em produção
- [Setup](docs/setup.md) - Configuração inicial
- [Arquitetura](docs/arquitetura.md) - Visão técnica
- [Segurança](docs/seguranca.md) - Medidas de segurança
- [Monitoramento](docs/monitoramento.md) - Observabilidade
- [Backup](docs/backup_disaster_recovery.md) - Estratégias de backup

## 🔧 Scripts Disponíveis

- `scripts/start-production.sh` - Deploy completo com verificações
- `scripts/setup-new-server.sh` - Setup inicial de servidor
- `scripts/deploy-production.sh` - Deploy automatizado
- `scripts/deploy-with-hooks.sh` - Demonstração de hooks

## 🚨 Troubleshooting

### Problemas Comuns
1. **Permissões**: Execute os scripts de setup
2. **Portas**: Verifique se 80/443 estão livres
3. **SSL**: Aguarde a geração automática de certificados
4. **Logs**: Use `docker compose logs [serviço]`

### Comandos Úteis
```bash
# Status dos containers
docker compose -f docker-compose.prod.yml ps

# Logs em tempo real
docker compose -f docker-compose.prod.yml logs -f [serviço]

# Reiniciar serviço
docker compose -f docker-compose.prod.yml restart [serviço]

# Backup dos volumes
sudo tar -czf backup-$(date +%Y%m%d).tar.gz /var/lib/docker/BASE/volumes/
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**BASE - Sistema de Gestão** - Desenvolvido com tecnologias modernas para máxima performance e confiabilidade.
