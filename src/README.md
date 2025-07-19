# Frontend React (PWA + i18n + Segurança)

## Como rodar em desenvolvimento
```bash
npm install
npm start
```

## Build de produção
```bash
npm run build
```

## Servir build localmente (simulando produção)
```bash
npx serve -s build
```

## Variáveis de ambiente
- `REACT_APP_API_URL`: URL base da API (ex: http://localhost:8000/api/v1)

## Internacionalização (i18n)
- Suporte a português e inglês.
- Para adicionar idiomas, edite `src/i18n/index.ts`.

## PWA (Progressive Web App)
- Service worker ativado por padrão.
- Atualização automática de versão.
- Fallback offline customizado em `public/offline.html`.
- Instale no celular ou desktop para acesso offline.

## Testes
- Testes unitários: `npm test`
- Testes de acessibilidade automatizados com `jest-axe`.

## Segurança
- Dados do backend são validados e sanitizados antes de exibir.
- Tokens de autenticação são gerenciados via cookies httpOnly (backend).

## Boas práticas
- Lazy loading e code splitting para páginas.
- Toast global para feedback ao usuário.
- Contexto de autenticação global.
- Pronto para integração com CI/CD e Docker.

---

Consulte a documentação do backend para detalhes de autenticação e integração. 