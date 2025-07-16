# Testes Automatizados do Backend

Esta pasta deve conter todos os testes unitários e de integração do backend.

## Estrutura sugerida
- `test_auth.py` – Testes do módulo de autenticação
- `test_products.py` – Testes do módulo de produtos

## Como rodar os testes

Ative o ambiente virtual e execute:

```bash
cd backend
source venv/bin/activate  # ou .\venv\Scripts\activate no Windows
pytest tests/
```

## Boas práticas
- Separe testes por módulo
- Use nomes claros para funções de teste
- Escreva testes para casos de sucesso e erro 