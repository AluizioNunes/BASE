# Frontend React (Vite + Tailwind + PWA)

## Stack
- React 18+
- Vite 5+
- Tailwind CSS 4
- shadcn-ui
- Lucide React
- date-fns
- Framer Motion
- PWA (vite-plugin-pwa)
- Internacionalização (i18n)
- Testes automatizados (Vitest)

## Estrutura
```
src/
  components/    # Componentes visuais (ui, PrivateRoute, etc.)
  context/       # Contextos globais (ex: AuthContext)
  hooks/         # Hooks customizados (ex: useAuth)
  i18n/          # Internacionalização (pt, en)
  layouts/       # Layouts base
  pages/         # Páginas (adicione suas páginas aqui)
  services/      # Integração API, Sentry
  styles/        # CSS global (index.css)
  utils/         # Utilitários (ex: cn)
  __tests__/     # Testes automatizados
```

## Como rodar em desenvolvimento
```bash
npm install
npm run dev
```
Acesse: http://localhost:5173/

## Build de produção
```bash
npm run build
```

## Servir build localmente (simulando produção)
```bash
npm run preview
```

## Testes
```bash
npm run test
npm run test:ui
```

## Variáveis de ambiente
- `VITE_API_URL`: URL base da API (ex: http://localhost:8000/api/v1)

## Internacionalização (i18n)
- Suporte a português e inglês.
- Para adicionar idiomas, edite `src/i18n/index.ts`.

## PWA (Progressive Web App)
- PWA ativado via vite-plugin-pwa.
- Atualização automática de versão.
- Instale no celular ou desktop para acesso offline.

## Observações
- Adicione suas páginas em `src/pages` e tipos globais em `src/types`.
- Ajuste variáveis de ambiente conforme necessário.
- Consulte a documentação do backend para detalhes de autenticação e integração. 