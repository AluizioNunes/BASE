# Rotas do Traefik - Estrutura de URLs

## 📋 **Visão Geral**

Este documento descreve a estrutura de rotas configuradas no Traefik para o sistema BASE.

## 🌐 **URLs de Acesso**

### **Frontend (React)**
- **Página Principal:** `http://[IP]/` ou `https://[IP]/`
- **Wizard de Setup:** `http://[IP]/wizard` ou `https://[IP]/wizard`
- **Login:** `http://[IP]/login` ou `https://[IP]/login`
- **Outras Páginas:** `http://[IP]/[outras-rotas]`

### **Backend (FastAPI)**
- **API:** `http://[IP]/api` ou `https://[IP]/api`
- **Documentação Swagger:** `http://[IP]/api/docs`
- **Health Check:** `http://[IP]/api/health`

### **Ferramentas de Administração**
- **Grafana (Monitoramento):** `http://[IP]/grafana` ou `https://[IP]/grafana`
- **Traefik Dashboard:** `http://[IP]/traefik` ou `https://[IP]/traefik`
- **RabbitMQ Management:** `http://[IP]/rabbitmq` ou `https://[IP]/rabbitmq`

## 🔧 **Configuração no Docker Compose**

### **Prioridades das Rotas**
1. **Prioridade 100:** Traefik Dashboard
2. **Prioridade 50:** Grafana
3. **Prioridade 20:** Wizard e Login
4. **Prioridade 10:** Frontend Principal e Backend API
5. **Prioridade 1:** Outras páginas do Frontend (fallback)

### **Estrutura de Rotas**

```yaml
# Frontend - Rotas específicas
frontend-main:     Path(`/`)                    # Página inicial
frontend-wizard:   PathPrefix(`/wizard`)        # Wizard de setup
frontend-login:    PathPrefix(`/login`)         # Página de login
frontend-other:    !PathPrefix(`/api|/grafana|/rabbitmq|/loki|/traefik|/wizard|/login`)

# Backend
backend:           PathPrefix(`/api`)           # API REST

# Ferramentas
grafana:           PathPrefix(`/grafana`)       # Monitoramento
traefik:           PathPrefix(`/traefik`)       # Dashboard Traefik
rabbitmq:          PathPrefix(`/rabbitmq`)      # Management RabbitMQ
```

## 🚀 **Como Usar**

### **1. Acesso Principal**
```
http://10.10.255.111/
```

### **2. Setup Inicial**
```
http://10.10.255.111/wizard
```

### **3. Login**
```
http://10.10.255.111/login
```

### **4. API**
```
http://10.10.255.111/api/health
http://10.10.255.111/api/docs
```

### **5. Monitoramento**
```
http://10.10.255.111/grafana
http://10.10.255.111/traefik
http://10.10.255.111/rabbitmq
```

## 🔒 **Segurança**

- **Todas as rotas** são protegidas pelo Traefik
- **Rate limiting** configurado para APIs
- **CORS** configurado para frontend
- **HTTPS** disponível quando configurado

## 📝 **Notas**

- O **Wizard** e **Login** têm prioridade alta para garantir acesso
- O **Frontend** principal serve como fallback para rotas não encontradas
- **Grafana** e **Traefik** têm prioridade média para administração
- **RabbitMQ** tem prioridade baixa (ferramenta de desenvolvimento) 