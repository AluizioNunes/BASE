# Scripts do Backend

Esta pasta contém scripts utilitários para tarefas administrativas, importação/exportação de dados, migrações, geração de relatórios, etc.

## Exemplos de scripts
- `importar_csv.py` – Importa dados de um arquivo CSV para o banco de dados
- `gerar_relatorio.py` – Gera relatórios a partir dos dados do sistema
- `backup_db.py` – Realiza backup do banco de dados

## Como rodar um script

Ative o ambiente virtual do backend e execute o script desejado:

```bash
cd backend
source venv/bin/activate  # ou .\venv\Scripts\activate no Windows
python scripts/importar_csv.py
```

## Boas práticas
- Documente cada script com comentários e instruções de uso
- Não armazene dados sensíveis em scripts
- Prefira usar variáveis de ambiente para senhas e conexões
- Sempre teste os scripts em ambiente de desenvolvimento antes de rodar em produção 