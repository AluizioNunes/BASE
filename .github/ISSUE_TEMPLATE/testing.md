---
name: Testing
about: Reporte problemas de testes ou sugira melhorias
title: '[TEST] '
labels: 'testing'
assignees: ''

---

## 🧪 Relatório de Testes

### 📋 Tipo de Relatório

- [ ] Teste falhando
- [ ] Sugestão de novo teste
- [ ] Problema de cobertura
- [ ] Teste lento
- [ ] Teste flaky (instável)
- [ ] Outro: _________

### 📝 Descrição

Descreva o problema de teste ou a sugestão de melhoria:

### 🎯 Tipo de Teste

- [ ] Teste unitário (Frontend)
- [ ] Teste unitário (Backend)
- [ ] Teste de integração
- [ ] Teste de acessibilidade
- [ ] Teste E2E
- [ ] Teste de performance
- [ ] Teste de segurança
- [ ] Outro: _________

### 🎯 Componente Testado

- [ ] Componente React
- [ ] Hook React
- [ ] Serviço de API
- [ ] Endpoint FastAPI
- [ ] Modelo de dados
- [ ] Utilitário
- [ ] Configuração
- [ ] Outro: _________

### 🔍 Como Reproduzir

Passos para reproduzir o problema:

```bash
# Frontend
npm test
npm run test:coverage
npm run test:accessibility

# Backend
cd Backend
pytest tests/
pytest --cov=app tests/
```

### 📊 Informações do Teste

- **Arquivo de teste:** `[caminho/do/arquivo/test_file.py]`
- **Nome do teste:** `[nome_do_teste]`
- **Framework:** [Jest, pytest, React Testing Library, etc.]
- **Ambiente:** [Node.js, Python, Docker]

### ❌ Erro Atual

```
[Cole aqui o erro completo do teste]
```

### ✅ Comportamento Esperado

Descreva o que o teste deveria fazer:

### 💡 Sugestão de Correção (opcional)

Se você tem ideias sobre como corrigir:

### 📈 Impacto

Qual o impacto deste problema:

- [ ] **Baixo** - Teste menor, não crítico
- [ ] **Médio** - Teste importante, mas não bloqueia
- [ ] **Alto** - Teste crítico que pode mascarar bugs
- [ ] **Crítico** - Teste essencial quebrado

### 🛠️ Ferramentas de Teste

Quais ferramentas você usou:

- [ ] Jest
- [ ] React Testing Library
- [ ] pytest
- [ ] Coverage
- [ ] jest-axe
- [ ] Cypress
- [ ] Playwright
- [ ] Outro: _________

### 🔗 Links Úteis

- **Documentação de Testes:** [docs/testes.md](docs/testes.md)
- **Jest Documentation:** https://jestjs.io/docs/getting-started
- **React Testing Library:** https://testing-library.com/docs/react-testing-library/intro/
- **pytest Documentation:** https://docs.pytest.org/

### 📚 Recursos

- [Testing Best Practices](https://testing-library.com/docs/guiding-principles)
- [Jest Best Practices](https://jestjs.io/docs/best-practices)
- [pytest Best Practices](https://docs.pytest.org/en/stable/explanation/goodpractices.html)

### 📊 Cobertura Atual

- **Frontend:** [X]%
- **Backend:** [X]%
- **E2E:** [X]%
- **Acessibilidade:** [X]%

---

**Obrigado por ajudar a manter a qualidade dos testes!** 🧪 