# Base Fullstack – React + Vite + FastAPI

Este projeto é um template fullstack moderno, pronto para produção, com:

## Principais recursos do Frontend
- Dashboard com **cards de resumo animados** (Framer Motion)
- **Filtros dinâmicos** (canal, mês) que afetam todos os gráficos
- **Gráficos interativos** (pizza, barra, linha) com ECharts, atualizados em tempo real conforme os filtros
- Animações Framer Motion em todos os componentes interativos (menus, modais, botões, badges, cards)
- Layout global com Sidebar e Navbar fixos

## Versões das principais dependências

### Frontend
- react: 19.1.0
- react-dom: 19.1.0
- vite: 7.0.5
- antd: 5.26.6
- echarts: 5.6.0
- echarts-for-react: 3.0.2
- vite-plugin-pwa: 1.0.1
- lucide-react: 0.525.0
- framer-motion: 12.23.6
- date-fns: 4.1.0
- sonner: 2.0.6
- react-router-dom: 7.7.0
- vitest: 3.2.4

### Backend
- fastapi==0.116.1
- uvicorn==0.35.0
- sqlalchemy==2.0.41
- pydantic==2.11.7
- python-dotenv==1.1.1
- psycopg-binary==3.2.9
- pytest==8.4.1
- loguru==0.7.3
- prometheus_client==0.22.1
- redis==6.2.0
- celery==5.5.3
- sentry-sdk==2.33.0
- alembic==1.16.4
- pandas==2.3.1
- flower==2.0.1
- slowapi==0.1.9
- bcrypt==4.3.0
- pydantic-settings==2.10.1
- python-multipart==0.0.20
- passlib==1.7.4
- python-jose==3.5.0

## Estrutura de Pastas
```
BASE/
  Backend/           # Backend FastAPI
    app/             # Código principal (core, modules, etc.)
    migrations/      # Alembic
    scripts/         # Scripts utilitários (crie seus próprios)
    tests/           # Testes automatizados
    uploads/         # Upload seguro de arquivos
  src/               # Frontend React + Vite
    components/      # Componentes (ui, Sidebar, Navbar, etc.)
    context/         # Contextos globais (ex: AuthContext)
    hooks/           # Hooks customizados
    i18n/            # Internacionalização
    layouts/         # Layouts base
    pages/           # Páginas (adicione suas páginas aqui)
    services/        # Integração API, Sentry
    styles/          # CSS global
    utils/           # Utilitários (ex: cn)
    __tests__/       # Testes frontend
  docs/              # Documentação avançada (arquitetura, deploy, segurança, etc.)
```

## Como rodar o Frontend
```bash
npm install
npm run dev
```
Acesse: http://localhost:5173/

## Como rodar o Backend
```bash
cd Backend
python3.13 -m venv venv
source venv/bin/activate  # ou .\venv\Scripts\activate no Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Ou rode tudo com Docker Compose:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

## Testes
- Frontend: `npm run test` (Vitest)
- Backend: `pytest` (na pasta Backend)

## Build de produção
- Frontend: `npm run build`
- Backend: use gunicorn/uvicorn em modo produção

## Documentação avançada
Veja a pasta `docs/` para detalhes de arquitetura, deploy, segurança, LGPD, backup, monitoramento, API, etc.

---

> **Observação:**
> - Scripts de backup/restore devem ser criados em `Backend/scripts`.
> - Adicione suas páginas em `src/pages` e tipos globais em `src/types`.
> - Ajuste variáveis de ambiente conforme necessário.
