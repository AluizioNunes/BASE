# 🔒 Segurança

Este documento descreve as medidas de segurança implementadas no sistema BASE.

## 🎯 Visão Geral

O sistema BASE implementa múltiplas camadas de segurança para proteger dados e infraestrutura:
- **SSL/TLS** automático com Let's Encrypt
- **Autenticação JWT** segura
- **CORS** configurado adequadamente
- **Permissões** específicas por serviço
- **Firewall** configurado automaticamente

## 🔐 Autenticação e Autorização

### JWT (JSON Web Tokens)

**Configuração Backend:**
```python
# Backend/app/core/config.py
SECRET_KEY: str = "BASE_SECRET_KEY_CHANGE_IN_PRODUCTION"
ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
```

**Implementação:**
```python
# Backend/app/modules/auth/services.py
from jose import JWTError, jwt
from datetime import datetime, timedelta

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
```

### CORS (Cross-Origin Resource Sharing)

**Configuração:**
```python
# Backend/app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://10.10.255.111"],  # Produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🔒 SSL/TLS

### Certificados Automáticos

**Traefik Configuration:**
```yaml
# docker-compose.prod.yml
traefik:
  command:
    - --certificatesresolvers.myresolver.acme.httpchallenge=true
    - --certificatesresolvers.myresolver.acme.httpchallenge.entrypoint=web
    - --certificatesresolvers.myresolver.acme.email=base@itfact.com.br
    - --certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json
```

**Benefícios:**
- ✅ Certificados gratuitos do Let's Encrypt
- ✅ Renovação automática
- ✅ HTTPS obrigatório
- ✅ HSTS (HTTP Strict Transport Security)

### Configuração de Segurança

```yaml
# Headers de segurança
labels:
  - "traefik.http.middlewares.security-headers.headers.customrequestheaders.X-Forwarded-Proto=https"
  - "traefik.http.middlewares.security-headers.headers.customresponseheaders.X-Frame-Options=DENY"
  - "traefik.http.middlewares.security-headers.headers.customresponseheaders.X-Content-Type-Options=nosniff"
  - "traefik.http.middlewares.security-headers.headers.customresponseheaders.X-XSS-Protection=1; mode=block"
```

## 🛡️ Permissões de Volumes

### Estratégia de Permissões

**Configuração por Serviço:**
```yaml
# docker-compose.prod.yml
grafana:
  user: "472:472"  # UID específico do Grafana

loki:
  user: "1000:1000"  # UID específico do Loki

db:
  # Usa UID padrão do PostgreSQL (999:999)
```

**Script de Configuração:**
```bash
# scripts/start-production.sh
sudo chown -R 472:472 /var/lib/docker/BASE/volumes/grafana_data
sudo chown -R 1000:1000 /var/lib/docker/BASE/volumes/loki_data
sudo chown -R 999:999 /var/lib/docker/BASE/volumes/postgres_data
sudo chown -R 999:999 /var/lib/docker/BASE/volumes/redis_data
sudo chown -R 999:999 /var/lib/docker/BASE/volumes/rabbitmq_data
sudo chown -R 1000:1000 /var/lib/docker/BASE/volumes/uploads_data
sudo chmod -R 755 /var/lib/docker/BASE/volumes/
```

### Isolamento de Dados

**Estrutura de Volumes:**
```
/var/lib/docker/BASE/volumes/
├── grafana_data/      # Apenas Grafana pode acessar
├── loki_data/         # Apenas Loki pode acessar
├── postgres_data/     # Apenas PostgreSQL pode acessar
├── redis_data/        # Apenas Redis pode acessar
├── rabbitmq_data/     # Apenas RabbitMQ pode acessar
├── uploads_data/      # Apenas Backend pode acessar
└── traefik_data/      # Apenas Traefik pode acessar
```

## 🔥 Firewall

### Configuração UFW

**Script de Configuração:**
```bash
# scripts/setup-new-server.sh
sudo ufw allow ssh
sudo ufw allow 80/tcp    # HTTP (para Let's Encrypt)
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 8000/tcp  # Portainer (opcional)
sudo ufw --force enable
```

**Regras de Firewall:**
```bash
# Verificar status
sudo ufw status verbose

# Regras ativas
- 22/tcp (SSH) - Permitido
- 80/tcp (HTTP) - Permitido (Let's Encrypt)
- 443/tcp (HTTPS) - Permitido
- 8000/tcp (Portainer) - Permitido (opcional)
- Demais portas - Bloqueadas
```

## 🚪 Controle de Acesso

### Basic Auth (Traefik)

**Configuração:**
```yaml
# docker-compose.prod.yml
labels:
  - "traefik.http.middlewares.traefik-auth.basicauth.users=BASE:$$2y$$10$$QmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0Uu"
```

**Acesso Protegido:**
- Traefik Dashboard: `https://SEU_IP/traefik/`
- Grafana: `https://SEU_IP/grafana/` (admin/BASE)
- Loki: `https://SEU_IP/loki/`

### Rate Limiting

**Configuração Traefik:**
```yaml
# Proteção contra ataques DDoS
labels:
  - "traefik.http.middlewares.ratelimit.ratelimit.average=100"
  - "traefik.http.middlewares.ratelimit.ratelimit.burst=50"
```

## 🔍 Auditoria e Logs

### Logs de Segurança

**Backend (FastAPI):**
```python
# Backend/app/core/logging_config.py
import logging
from loguru import logger

# Logs de autenticação
logger.info(f"Login attempt: {username} from {client_ip}")

# Logs de autorização
logger.warning(f"Unauthorized access attempt: {endpoint} from {client_ip}")

# Logs de erro
logger.error(f"Security error: {error_details}")
```

**Frontend (React):**
```typescript
// src/services/sentry.ts
import * as Sentry from "@sentry/react";

// Captura de erros de segurança
Sentry.captureException(error, {
  tags: {
    security: "authentication_error",
    user_id: user?.id
  }
});
```

### Monitoramento de Segurança

**Métricas Importantes:**
- Tentativas de login falhadas
- Acessos não autorizados
- Taxa de erro por endpoint
- Requisições suspeitas

**Alertas:**
```yaml
# Grafana Alerting
alerts:
  - name: "Multiple Failed Logins"
    condition: "rate(login_failures_total[5m]) > 10"
    severity: "warning"
    
  - name: "Unauthorized Access"
    condition: "rate(unauthorized_requests_total[5m]) > 5"
    severity: "critical"
```

## 🛡️ Validação de Dados

### Pydantic (Backend)

**Schemas de Validação:**
```python
# Backend/app/modules/auth/schemas.py
from pydantic import BaseModel, EmailStr, validator

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain uppercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain number')
        return v
```

### TypeScript (Frontend)

**Validação de Formulários:**
```typescript
// src/components/UsuarioModal.tsx
import { Form, Input, Button } from 'antd';

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string) => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /\d/.test(password);
};
```

## 🔐 Segurança de Senhas

### Hash de Senhas

**Backend (bcrypt):**
```python
# Backend/app/modules/auth/services.py
import bcrypt

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
```

### Política de Senhas

**Requisitos:**
- Mínimo 8 caracteres
- Pelo menos 1 letra maiúscula
- Pelo menos 1 número
- Pelo menos 1 caractere especial
- Não pode ser senha comum

## 🚨 Incidentes de Segurança

### Procedimento de Resposta

**1. Identificação:**
```bash
# Verificar logs de segurança
docker compose -f docker-compose.prod.yml logs backend | grep -i "error\|unauthorized\|failed"

# Verificar tentativas de login
docker exec -it [postgres_container] psql -U BASE -d BASE -c "SELECT * FROM auth_logs WHERE created_at > NOW() - INTERVAL '1 hour';"
```

**2. Contenção:**
```bash
# Bloquear IP suspeito
sudo ufw deny from SUSPICIOUS_IP

# Parar serviços afetados
docker compose -f docker-compose.prod.yml stop [serviço_afetado]
```

**3. Análise:**
```bash
# Coletar evidências
docker logs [container] > /tmp/security_incident_$(date +%Y%m%d_%H%M%S).log

# Verificar integridade dos dados
./scripts/verify-backup.sh
```

**4. Recuperação:**
```bash
# Restaurar de backup limpo
./scripts/restore.sh backup_antes_incidente.tar.gz

# Reconfigurar segurança
./scripts/start-production.sh
```

## 📋 Checklist de Segurança

### Configuração Inicial
- [ ] SSL/TLS configurado
- [ ] Firewall ativo
- [ ] Permissões de volumes corretas
- [ ] Senhas fortes definidas
- [ ] CORS configurado
- [ ] Rate limiting ativo

### Manutenção Regular
- [ ] Atualizações de segurança
- [ ] Verificação de logs
- [ ] Teste de backup
- [ ] Auditoria de permissões
- [ ] Monitoramento de alertas

### Monitoramento Contínuo
- [ ] Logs de autenticação
- [ ] Tentativas de acesso não autorizado
- [ ] Performance de SSL
- [ ] Status do firewall
- [ ] Integridade dos certificados

## 🔧 Ferramentas de Segurança

### Análise de Vulnerabilidades

**Docker Security:**
```bash
# Verificar vulnerabilidades em imagens
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image grafana/grafana:latest

# Verificar configurações de segurança
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy config .
```

**Dependências:**
```bash
# Backend (Python)
pip-audit

# Frontend (Node.js)
npm audit
npm audit fix
```

### Testes de Segurança

**Teste de Penetração:**
```bash
# Verificar portas abertas
nmap -sS -sV SEU_IP

# Testar SSL/TLS
openssl s_client -connect SEU_IP:443 -servername SEU_IP

# Verificar headers de segurança
curl -I https://SEU_IP/
```

---

**BASE - Sistema de Gestão** - Segurança em camadas para máxima proteção. 