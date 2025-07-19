# Guia de Setup para Novos Desenvolvedores

## 1. Clonar o repositório
```bash
git clone <url-do-repo>
```

## 2. Backend (FastAPI)
```bash
cd Backend
python -m venv venv
. venv/Scripts/activate  # Windows
# ou
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
cp .env.example .env  # Configure variáveis de ambiente
```

## 3. Frontend (React)
```bash
cd ../
npm install
cp .env.example .env  # Configure REACT_APP_API_URL
npm start
```

## 4. Rodar tudo com Docker Compose
```bash
docker-compose up --build
```

## 5. Versionamento de banco
- Alembic para criar e aplicar migrações.

## 6. Testes
- Backend: pytest
- Frontend: npm test (inclui jest-axe para acessibilidade)

## 7. Internacionalização (i18n)
- Suporte a pt/en. Edite `src/i18n/index.ts` para novos idiomas.

## 8. PWA
- Service worker ativado por padrão. Fallback offline em `public/offline.html`.

## 9. Recomendações
- Healthchecks para todos os serviços
- Volumes persistentes para uploads e banco
- Reverse proxy (Traefik 3.4)
- Separação de ambientes (dev, staging, prod) 