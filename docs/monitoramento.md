# 📊 Monitoramento e Observabilidade

Este documento descreve a estratégia de monitoramento e observabilidade do sistema BASE, incluindo métricas, logs e alertas.

## 🎯 Visão Geral

O sistema BASE utiliza uma abordagem moderna de observabilidade com:
- **Grafana** para dashboards e visualização
- **Loki** para agregação e busca de logs
- **Traefik** para métricas de proxy e SSL
- **Health Checks** para verificação de saúde dos serviços

## 🏗️ Arquitetura de Monitoramento

```
┌─────────────────────────────────────────────────────────────┐
│                    APLICAÇÃO                                │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │   Frontend   │  │   Backend    │  │   Infraestrutura│   │
│  │   (React)    │  │   (FastAPI)  │  │   (Docker)      │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    COLETA DE DADOS                          │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │   Logs       │  │   Métricas   │  │   Traces        │   │
│  │   (Loki)     │  │   (Traefik)  │  │   (Futuro)      │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    VISUALIZAÇÃO                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    GRAFANA                              │ │
│  │  • Dashboards de métricas                              │ │
│  │  • Visualização de logs                                │ │
│  │  • Alertas e notificações                              │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📈 Métricas

### Traefik (Proxy Reverso)

**Métricas Disponíveis:**
- Requisições por segundo (RPS)
- Latência média e percentis
- Taxa de erro (4xx, 5xx)
- Status de certificados SSL
- Uso de memória e CPU
- Conexões ativas

**Acesso:**
- **Dashboard**: `https://SEU_IP/traefik/`
- **API**: `http://localhost:8080/api/`

### Aplicação (FastAPI)

**Métricas Disponíveis:**
- Endpoints mais acessados
- Tempo de resposta por endpoint
- Taxa de erro por endpoint
- Uso de memória e CPU
- Conexões de banco de dados
- Cache hit rate

**Configuração:**
```python
# Backend/app/core/monitoring.py
from prometheus_client import Counter, Histogram, Gauge

# Métricas customizadas
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests')
REQUEST_LATENCY = Histogram('http_request_duration_seconds', 'HTTP request latency')
ACTIVE_CONNECTIONS = Gauge('active_connections', 'Active database connections')
```

### Infraestrutura

**PostgreSQL:**
- Conexões ativas/inativas
- Queries por segundo
- Tempo médio de query
- Uso de cache
- Tamanho do banco

**Redis:**
- Hit rate
- Uso de memória
- Comandos por segundo
- Conexões ativas
- Chaves expiradas

**RabbitMQ:**
- Filas ativas
- Mensagens por segundo
- Consumidores ativos
- Uso de memória
- Status de nodes

## 📝 Logs

### Loki (Agregação de Logs)

**Configuração:**
```yaml
# docker-compose.prod.yml
loki:
  image: grafana/loki:latest
  user: "1000:1000"
  command: -config.file=/etc/loki/local-config.yaml
  volumes:
    - /var/lib/docker/BASE/volumes/loki_data:/loki
```

**Estrutura de Logs:**
```json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "level": "INFO",
  "service": "backend",
  "endpoint": "/api/users",
  "method": "GET",
  "status_code": 200,
  "response_time": 150,
  "user_id": "123",
  "ip": "192.168.1.1"
}
```

**Queries Loki:**
```logql
# Logs de erro do backend
{service="backend"} |= "ERROR"

# Requisições lentas (>1s)
{service="backend"} | json | response_time > 1000

# Logs por endpoint
{service="backend"} | json | endpoint="/api/users"

# Logs de autenticação
{service="backend"} | json | endpoint=~".*auth.*"
```

### Configuração de Logs

**Backend (FastAPI):**
```python
# Backend/app/core/logging_config.py
import logging
from loguru import logger

# Configuração estruturada
logger.add(
    "logs/app.log",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {name}:{function}:{line} | {message}",
    level="INFO",
    rotation="1 day",
    retention="30 days"
)
```

**Frontend (React):**
```typescript
// src/services/sentry.ts
import * as Sentry from "@sentry/react";

// Configuração de error tracking
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
});
```

## 📊 Dashboards Grafana

### Dashboard Principal

**Métricas Gerais:**
- Requisições por minuto
- Taxa de erro
- Latência média
- Usuários ativos
- Uso de recursos

**Configuração:**
```json
{
  "dashboard": {
    "title": "BASE - Sistema de Gestão",
    "panels": [
      {
        "title": "Requisições por Minuto",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[1m])",
            "legendFormat": "{{method}} {{endpoint}}"
          }
        ]
      }
    ]
  }
}
```

### Dashboard de Infraestrutura

**Métricas do Sistema:**
- CPU e memória por container
- Uso de disco
- Rede (bytes in/out)
- Status dos serviços

### Dashboard de Aplicação

**Métricas de Negócio:**
- Usuários ativos
- Operações por tipo
- Performance de queries
- Cache hit rate

## 🚨 Alertas

### Configuração de Alertas

**Grafana Alerting:**
```yaml
# Alertas configurados
alerts:
  - name: "High Error Rate"
    condition: "rate(http_requests_total{status=~\"5..\"}[5m]) > 0.1"
    duration: "5m"
    severity: "critical"
    
  - name: "High Latency"
    condition: "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1"
    duration: "5m"
    severity: "warning"
    
  - name: "Service Down"
    condition: "up{job=\"backend\"} == 0"
    duration: "1m"
    severity: "critical"
```

### Notificações

**Canais de Notificação:**
- **Email**: Para alertas críticos
- **Slack**: Para alertas de warning
- **Webhook**: Para integração com sistemas externos

## 🔍 Troubleshooting

### Comandos Úteis

**Verificar Logs:**
```bash
# Logs em tempo real
docker compose -f docker-compose.prod.yml logs -f [serviço]

# Logs específicos
docker logs [container_name] --tail 100

# Buscar logs no Loki
curl -G -s "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode 'query={service="backend"}' \
  --data-urlencode 'start=1640995200' \
  --data-urlencode 'end=1640998800'
```

**Verificar Métricas:**
```bash
# Métricas do Traefik
curl -s http://localhost:8080/metrics | grep http_requests_total

# Health checks
curl -s http://localhost:8080/api/http/services | jq

# Status dos containers
docker compose -f docker-compose.prod.yml ps
```

### Problemas Comuns

**Logs não aparecem no Grafana:**
```bash
# Verificar se Loki está rodando
docker compose -f docker-compose.prod.yml ps loki

# Verificar permissões
sudo chown -R 1000:1000 /var/lib/docker/BASE/volumes/loki_data

# Verificar configuração
docker logs [loki_container] | grep -i error
```

**Métricas não atualizam:**
```bash
# Verificar Traefik
curl -s http://localhost:8080/api/http/routers

# Verificar conectividade
docker exec [traefik_container] wget -qO- http://backend:8000/health

# Verificar configuração de labels
docker inspect [container] | grep -A 10 Labels
```

## 📈 Performance

### Otimizações

**Loki:**
- Configurar retenção adequada
- Usar índices eficientes
- Comprimir logs antigos

**Grafana:**
- Cache de queries
- Dashboards otimizados
- Alertas eficientes

**Traefik:**
- Rate limiting
- Compressão
- Cache de certificados

### Monitoramento de Performance

**Métricas Chave:**
- **Apdex**: Satisfação do usuário
- **Throughput**: Requisições por segundo
- **Error Rate**: Taxa de erro
- **Response Time**: Tempo de resposta

## 🔧 Configuração Avançada

### Customização de Dashboards

**Criar Dashboard Personalizado:**
1. Acesse Grafana: `https://SEU_IP/grafana/`
2. Login: `admin/BASE`
3. Crie novo dashboard
4. Adicione painéis com queries Loki/LogQL
5. Configure alertas

### Integração com Sistemas Externos

**Prometheus (Futuro):**
```yaml
# Configuração para métricas customizadas
prometheus:
  image: prom/prometheus:latest
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  ports:
    - "9090:9090"
```

**Jaeger (Futuro):**
```yaml
# Configuração para distributed tracing
jaeger:
  image: jaegertracing/all-in-one:latest
  ports:
    - "16686:16686"
```

## 📚 Recursos Adicionais

### Documentação Oficial
- [Grafana Documentation](https://grafana.com/docs/)
- [Loki Documentation](https://grafana.com/docs/loki/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)

### Templates e Dashboards
- [Grafana Dashboard Library](https://grafana.com/grafana/dashboards/)
- [Loki Query Examples](https://grafana.com/docs/loki/latest/logql/)

---

**BASE - Sistema de Gestão** - Monitoramento completo para máxima visibilidade e confiabilidade.