---
name: Performance
about: Reporte problemas de performance ou sugira melhorias
title: '[PERF] '
labels: 'performance'
assignees: ''

---

## ⚡ Relatório de Performance

### 📋 Tipo de Relatório

- [ ] Problema de performance (lentidão)
- [ ] Sugestão de otimização
- [ ] Comparação de performance
- [ ] Outro: _________

### 📝 Descrição

Descreva o problema de performance ou a sugestão de melhoria:

### 🎯 Componente Afetado

- [ ] Frontend (React)
- [ ] Backend (FastAPI)
- [ ] Banco de dados (PostgreSQL)
- [ ] Cache (Redis)
- [ ] Message broker (RabbitMQ)
- [ ] Docker/Containers
- [ ] Traefik/Proxy
- [ ] Monitoramento (Grafana/Loki)
- [ ] Build/Deploy
- [ ] Outro: _________

### 📊 Métricas Atuais

Se aplicável, inclua métricas de performance:

- **Tempo de resposta:** [ex: 2.5s]
- **Throughput:** [ex: 100 req/s]
- **Uso de CPU:** [ex: 80%]
- **Uso de memória:** [ex: 2GB]
- **Tempo de build:** [ex: 5min]

### 🔍 Como Reproduzir

Passos para reproduzir o problema de performance:

1. Execute `docker-compose -f docker-compose.dev.yml up --build`
2. Acesse http://localhost:3000
3. Execute a ação que causa lentidão
4. Observe o tempo de resposta

### 💡 Sugestão de Otimização (opcional)

Se você tem ideias sobre como melhorar a performance:

### 📈 Impacto Esperado

Qual melhoria de performance você espera:

- [ ] Redução de 50% no tempo de resposta
- [ ] Aumento de 2x no throughput
- [ ] Redução de 30% no uso de recursos
- [ ] Melhoria no tempo de build
- [ ] Outro: _________

### 🔧 Ambiente de Teste

- **Sistema Operacional:** [ex: Ubuntu 22.04]
- **Docker:** [ex: 20.10.21]
- **Node.js:** [ex: 20.0.0]
 - **Python:** [ex: 3.13.5]
- **Hardware:** [ex: 8GB RAM, 4 cores]

### 📚 Recursos

Links úteis relacionados:
- [React Performance](https://reactjs.org/docs/optimizing-performance.html)
- [FastAPI Performance](https://fastapi.tiangolo.com/tutorial/performance/)
- [Docker Performance](https://docs.docker.com/develop/dev-best-practices/)
- [PostgreSQL Performance](https://www.postgresql.org/docs/current/performance.html)

### 🔗 Links Úteis

- **Monitoramento:** [docs/monitoramento.md](docs/monitoramento.md)
- **Grafana:** http://localhost:3001
- **Prometheus:** http://localhost:8000/metrics

---

**Obrigado por ajudar a otimizar o BASE!** 🚀 