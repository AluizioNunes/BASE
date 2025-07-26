# Template BASE – Deploy Rápido com Docker Compose

Este template entrega uma stack completa para aplicações modernas, pronta para produção, com frontend, backend, banco, cache, mensageria, monitoramento e proxy reverso, tudo orquestrado via Traefik.

## Serviços inclusos
- **Frontend (React/Vite/Node.js)**
- **Backend (FastAPI/Python)**
- **Postgres**
- **Redis**
- **RabbitMQ**
- **Grafana**
- **Loki**
- **Traefik** (proxy reverso, SSL automático)

## Como fazer o deploy
1. **Edite o arquivo `docker-compose.prod.yml`**
   - Ajuste variáveis de ambiente conforme seu ambiente
   - Troque senhas padrão para produção real
2. **Suba a stack:**
   ```sh
   docker compose -f docker-compose.prod.yml up -d
   ```
3. **Acesse os serviços:**
   - Frontend:         https://<IP-OU-DOMINIO>/
   - Backend (docs):   https://<IP-OU-DOMINIO>/api/docs
   - Traefik:          https://<IP-OU-DOMINIO>/traefik (usuário/senha: BASE)
   - Grafana:          https://<IP-OU-DOMINIO>/grafana (usuário/senha: BASE)
   - Loki:             https://<IP-OU-DOMINIO>/loki
   - RabbitMQ:         https://<IP-OU-DOMINIO>/rabbitmq (usuário/senha: BASE)
   - Redis:            https://<IP-OU-DOMINIO>/redis

## Dicas de customização
- Altere variáveis de ambiente para seu cenário
- Use arquivos `.env` para segredos em produção
- Adicione/remova serviços conforme sua necessidade
- Troque as imagens para versões fixas se quiser estabilidade
- Faça backup regular do diretório `/var/lib/docker/BASE/volumes/`

## Segurança
- Troque todas as senhas padrão para produção real
- Restrinja acesso ao painel Traefik e outros painéis sensíveis
- Mantenha Docker e imagens sempre atualizados

---

> **Dúvidas?** Consulte o arquivo `DEPLOY_CHECKLIST.md` para um passo a passo detalhado! 