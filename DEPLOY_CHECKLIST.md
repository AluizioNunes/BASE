# Checklist de Deploy – Template BASE

## 1. Pré-requisitos
- Docker e Docker Compose instalados
- Acesso root ou sudo ao servidor
- Domínio/apontamento DNS para o IP do servidor (opcional, mas recomendado para SSL)
- Firewall liberando apenas as portas 80 e 443
- Backup do diretório `/var/lib/docker/BASE/volumes/` (se já houver dados)

## 2. Configuração
- Revise o arquivo `docker-compose.prod.yml`:
  - Ajuste variáveis de ambiente conforme necessário (usuário, senha, host, etc.)
  - Se for produção real, troque todas as senhas padrão (BASE)
  - Se desejar, use um arquivo `.env` e adicione `env_file: .env` nos serviços
  - Confirme que os volumes estão corretos para persistência
  - Ajuste o e-mail do Traefik para o seu

## 3. Deploy
```sh
docker compose -f docker-compose.prod.yml up -d
```

## 4. Acesso aos serviços
- Frontend:         https://<IP-OU-DOMINIO>/
- Backend (docs):   https://<IP-OU-DOMINIO>/api/docs
- Traefik:          https://<IP-OU-DOMINIO>/traefik (usuário/senha: BASE)
- Grafana:          https://<IP-OU-DOMINIO>/grafana (usuário/senha: BASE)
- Loki:             https://<IP-OU-DOMINIO>/loki
- RabbitMQ:         https://<IP-OU-DOMINIO>/rabbitmq (usuário/senha: BASE)
- Redis:            https://<IP-OU-DOMINIO>/redis

## 5. Validação
- Verifique se todos os containers estão rodando:
  ```sh
  docker compose -f docker-compose.prod.yml ps
  ```
- Acesse cada painel/página para garantir que tudo está funcionando
- Teste upload de arquivos e persistência

## 6. Segurança e manutenção
- Troque todas as senhas padrão para produção real
- Faça backup regular do diretório de volumes
- Mantenha Docker e imagens sempre atualizados
- Restrinja acesso ao painel Traefik e outros painéis sensíveis
- Monitore logs e recursos do servidor

---

> **Dica:** Para atualizar, basta rodar:
> ```sh
> docker compose -f docker-compose.prod.yml pull
> docker compose -f docker-compose.prod.yml up -d
> ``` 