# Suporte

## 📞 Como obter ajuda

### 🐛 **Reportar Bugs**

Se você encontrou um bug, por favor:

1. **Verifique se já foi reportado**
   - Procure nas [Issues](https://github.com/AluizioNunes/BASE-REACT-FASTAPI/issues)
   - Use a busca para encontrar issues similares

2. **Crie uma nova issue**
   - Use o template [Bug Report](https://github.com/AluizioNunes/BASE-REACT-FASTAPI/issues/new?template=bug_report.md)
   - Inclua informações detalhadas sobre o problema

3. **Informações necessárias**
   - Sistema operacional
   - Versão do Docker
   - Versão do Node.js
   - Versão do Python
   - Logs de erro
   - Passos para reproduzir

### 💡 **Solicitar Features**

Para solicitar uma nova funcionalidade:

1. **Verifique se já foi solicitada**
   - Procure nas [Issues](https://github.com/AluizioNunes/BASE-REACT-FASTAPI/issues)
   - Use a busca para encontrar requests similares

2. **Crie uma nova issue**
   - Use o template [Feature Request](https://github.com/AluizioNunes/BASE-REACT-FASTAPI/issues/new?template=feature_request.md)
   - Descreva a funcionalidade desejada

### ❓ **Perguntas Gerais**

Para dúvidas sobre uso, configuração ou desenvolvimento:

1. **Consulte a documentação**
   - [README.md](README.md) - Visão geral
   - [docs/setup.md](docs/setup.md) - Configuração inicial
   - [docs/arquitetura.md](docs/arquitetura.md) - Arquitetura
   - [docs/deploy.md](docs/deploy.md) - Deploy

2. **Procure em issues existentes**
   - Use a busca para encontrar perguntas similares
   - Verifique se sua dúvida já foi respondida

3. **Crie uma nova issue**
   - Use o template [Question](https://github.com/AluizioNunes/BASE-REACT-FASTAPI/issues/new)
   - Seja específico sobre sua dúvida

## 🔧 **Problemas Comuns**

### **Docker não inicia**
```bash
# Verificar se o Docker está rodando
docker --version
docker-compose --version

# Verificar logs
docker-compose logs [serviço]

# Rebuild containers
docker-compose down
docker-compose up --build
```

### **Porta já em uso**
```bash
# Verificar portas em uso
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000

# Parar serviços conflitantes
sudo systemctl stop [serviço]
```

### **Erro de permissão**
```bash
# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Recarregar grupos
newgrp docker
```

### **Banco de dados não conecta**
```bash
# Verificar se o PostgreSQL está rodando
docker-compose ps

# Verificar logs do banco
docker-compose logs db

# Resetar banco (cuidado!)
docker-compose down -v
docker-compose up --build
```

## 📚 **Recursos Úteis**

### **Documentação Oficial**
- [React Documentation](https://reactjs.org/docs/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)

### **Comunidades**
- [React Community](https://reactjs.org/community/support.html)
- [FastAPI Community](https://fastapi.tiangolo.com/community/)
- [Docker Community](https://www.docker.com/community/)

### **Tutoriais**
- [React Tutorial](https://reactjs.org/tutorial/tutorial.html)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [Docker Tutorial](https://docs.docker.com/get-started/)

## 🆘 **Contato Direto**

Se você não conseguiu resolver seu problema através dos canais acima:

- 📧 **Email:** [seu-email@exemplo.com]
- 💬 **Discord:** [Link do servidor]
- 📱 **Telegram:** [Link do grupo]

## 🤝 **Contribuir**

Se você quer ajudar a melhorar o projeto:

1. **Fork o repositório**
2. **Crie uma branch** para sua feature
3. **Faça suas mudanças**
4. **Teste suas mudanças**
5. **Abra um Pull Request**

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para mais detalhes.

## ⏰ **Tempo de Resposta**

- **Bugs críticos:** 24-48 horas
- **Bugs normais:** 3-7 dias
- **Feature requests:** 1-2 semanas
- **Perguntas gerais:** 1-3 dias

## 🎯 **Antes de Pedir Ajuda**

1. **Leia a documentação** completa
2. **Teste em ambiente limpo**
3. **Procure por issues similares**
4. **Prepare informações detalhadas**
5. **Seja respeitoso e paciente**

---

**Obrigado por usar o BASE! Estamos aqui para ajudar.** 🙏 