# Política de Segurança

## Versões Suportadas

Use esta seção para informar às pessoas sobre quais versões do seu projeto estão atualmente sendo suportadas com atualizações de segurança.

| Versão | Suportada          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| 0.9.x   | :x:                |
| 0.8.x   | :white_check_mark: |
| < 0.8   | :x:                |

## Reportando uma Vulnerabilidade

Se você descobrir uma vulnerabilidade de segurança, por favor, **NÃO** abra uma issue pública. Em vez disso, envie um email para [seu-email@exemplo.com] com os detalhes da vulnerabilidade.

### O que incluir no relatório:

1. **Descrição da vulnerabilidade**
   - Tipo de vulnerabilidade (XSS, SQL Injection, etc.)
   - Componente afetado (Frontend, Backend, API, etc.)
   - Versão do software afetada

2. **Passos para reproduzir**
   - Comandos ou ações específicas
   - Dados de exemplo (se aplicável)
   - Screenshots ou logs (se aplicável)

3. **Impacto potencial**
   - O que um atacante poderia fazer
   - Dados que poderiam ser comprometidos
   - Severidade estimada (Baixa, Média, Alta, Crítica)

4. **Sugestões de correção (opcional)**
   - Se você tem ideias sobre como corrigir
   - Referências a boas práticas de segurança

### Processo de resposta:

1. **Confirmação (24-48h)**
   - Você receberá uma confirmação de que o relatório foi recebido
   - Uma avaliação inicial será feita

2. **Investigações (1-7 dias)**
   - A equipe investigará a vulnerabilidade
   - Você será mantido informado sobre o progresso

3. **Correção e divulgação**
   - Uma correção será desenvolvida e testada
   - Uma nova versão será lançada
   - A vulnerabilidade será divulgada publicamente (se necessário)

### Agradecimentos:

Relatórios de segurança responsáveis são muito importantes para manter a segurança do projeto. Agradecemos a todos que contribuem para a segurança do BASE.

## Boas Práticas de Segurança

### Para Desenvolvedores:

1. **Mantenha dependências atualizadas**
   ```bash
   npm audit fix
   pip install --upgrade -r requirements.txt
   ```

2. **Use variáveis de ambiente para secrets**
   ```bash
   # Nunca commite senhas no código
   export DATABASE_PASSWORD="sua_senha_segura"
   ```

3. **Valide todas as entradas do usuário**
   ```python
   # Backend - FastAPI
   from pydantic import BaseModel, validator
   
   class UserInput(BaseModel):
       email: str
       
       @validator('email')
       def validate_email(cls, v):
           if '@' not in v:
               raise ValueError('Email inválido')
           return v
   ```

4. **Use HTTPS em produção**
   ```yaml
   # docker-compose.prod.yml
   traefik:
     command:
       - --entrypoints.websecure.address=:443
   ```

### Para Usuários:

1. **Mantenha o sistema atualizado**
2. **Use senhas fortes**
3. **Configure backup regular**
4. **Monitore logs de segurança**
5. **Use firewall adequado**

## Recursos de Segurança

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [React Security](https://reactjs.org/docs/security.html)
- [Docker Security](https://docs.docker.com/engine/security/)

## Histórico de Vulnerabilidades

| Data | Versão | Vulnerabilidade | Status |
|------|--------|-----------------|--------|
| - | - | - | - |

---

**Obrigado por ajudar a manter o BASE seguro!** 🔒 