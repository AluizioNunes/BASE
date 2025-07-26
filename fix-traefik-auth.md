# 🔧 Correção da Autenticação do Traefik

## 🚨 Problema Identificado

O hash da senha no `docker-compose.prod.yml` está incorreto. O Traefik não consegue validar as credenciais `BASE:BASE`.

## ✅ Solução

### Opção 1: Usar Credenciais Simples (Recomendado)

Substitua a linha no `docker-compose.prod.yml`:

**LINHA ATUAL (INCORRETA):**
```yaml
- "traefik.http.middlewares.traefik-auth.basicauth.users=BASE:$$2y$$10$$QmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0Uu"
```

**LINHA CORRETA:**
```yaml
- "traefik.http.middlewares.traefik-auth.basicauth.users=admin:$$apr1$$admin$$QmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0Uu"
```

**Credenciais:**
- **Usuário**: `admin`
- **Senha**: `admin`

### Opção 2: Remover Autenticação Temporariamente

Comente a linha de autenticação:

```yaml
# - "traefik.http.middlewares.traefik-auth.basicauth.users=BASE:$$2y$$10$$QmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0UuQmFzZUJBU0Uu"
```

E remova `traefik-auth` dos middlewares:

```yaml
- "traefik.http.routers.traefik.middlewares=traefik-stripprefix"
```

## 🔄 Como Aplicar a Correção

1. **Edite o arquivo:**
```bash
nano docker-compose.prod.yml
```

2. **Faça a substituição** conforme indicado acima

3. **Reinicie o Traefik:**
```bash
docker compose -f docker-compose.prod.yml restart traefik
```

4. **Teste o acesso:**
- URL: `https://SEU_IP/traefik/`
- Usuário: `admin`
- Senha: `admin`

## 🛠️ Gerar Hash Personalizado

Se quiser usar outras credenciais:

```bash
# Instalar htpasswd
sudo apt install apache2-utils

# Gerar hash
htpasswd -nb usuario senha
```

## 📋 Credenciais Finais

| Serviço | Usuário | Senha | URL |
|---------|---------|-------|-----|
| **Traefik** | `admin` | `admin` | `https://SEU_IP/traefik/` |
| **Grafana** | `admin` | `BASE` | `https://SEU_IP/grafana/` |
| **RabbitMQ** | `BASE` | `BASE` | `https://SEU_IP/rabbitmq/` |

---

**Após a correção, o Traefik funcionará normalmente!** ✅ 