---
name: DevOps
about: Reporte problemas de DevOps ou sugira melhorias
title: '[DEVOPS] '
labels: 'devops'
assignees: ''

---

## 🐳 Relatório de DevOps

### 📋 Tipo de Relatório

- [ ] Problema de Docker
- [ ] Problema de CI/CD
- [ ] Problema de deploy
- [ ] Problema de monitoramento
- [ ] Sugestão de melhoria
- [ ] Outro: _________

### 📝 Descrição

Descreva o problema de DevOps ou a sugestão de melhoria:

### 🎯 Área Afetada

- [ ] Docker/Containers
- [ ] Docker Compose
- [ ] GitHub Actions (CI/CD)
- [ ] Deploy
- [ ] Monitoramento (Grafana/Loki)
- [ ] Traefik/Proxy
- [ ] Volumes/Dados
- [ ] Backup
- [ ] Outro: _________

### 🔍 Como Reproduzir

Passos para reproduzir o problema:

```bash
# Docker
docker-compose -f docker-compose.dev.yml up --build
docker-compose -f docker-compose.prod.yml up --build

# Verificar logs
docker-compose logs [serviço]
docker ps
docker system df
```

### 📊 Informações do Ambiente

- **Sistema Operacional:** [ex: Ubuntu 22.04]
- **Docker:** [ex: 20.10.21]
- **Docker Compose:** [ex: 2.0.0]
- **Arquivo usado:** [docker-compose.yml, docker-compose.prod.yml, etc.]

### ❌ Erro Atual

```
[Cole aqui o erro completo]
```

### ✅ Comportamento Esperado

Descreva o que deveria acontecer:

### 💡 Sugestão de Correção (opcional)

Se você tem ideias sobre como corrigir:

### 📈 Impacto

Qual o impacto deste problema:

- [ ] **Baixo** - Melhoria geral
- [ ] **Médio** - Afeta desenvolvimento
- [ ] **Alto** - Afeta deploy
- [ ] **Crítico** - Sistema não funciona

### 🛠️ Ferramentas Usadas

- [ ] Docker
- [ ] Docker Compose
- [ ] GitHub Actions
- [ ] Traefik
- [ ] Grafana
- [ ] Loki
- [ ] Portainer
- [ ] Outro: _________

### 🔗 Links Úteis

- **Documentação de Deploy:** [docs/deploy.md](docs/deploy.md)
- **Documentação de Monitoramento:** [docs/monitoramento.md](docs/monitoramento.md)
- **Docker Documentation:** https://docs.docker.com/
- **Traefik Documentation:** https://doc.traefik.io/traefik/

### 📚 Recursos

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Traefik Best Practices](https://doc.traefik.io/traefik/middlewares/overview/)

### 🔧 Comandos Úteis

```bash
# Verificar status dos containers
docker-compose ps

# Ver logs de um serviço específico
docker-compose logs -f [serviço]

# Rebuild containers
docker-compose down
docker-compose up --build

# Limpar recursos não utilizados
docker system prune -a

# Verificar uso de recursos
docker stats
```

### 📊 Status dos Serviços

- [ ] **Traefik:** Funcionando
- [ ] **Frontend:** Funcionando
- [ ] **Backend:** Funcionando
- [ ] **PostgreSQL:** Funcionando
- [ ] **Redis:** Funcionando
- [ ] **RabbitMQ:** Funcionando
- [ ] **Grafana:** Funcionando
- [ ] **Loki:** Funcionando

---

**Obrigado por ajudar a manter a infraestrutura do BASE!** 🐳 