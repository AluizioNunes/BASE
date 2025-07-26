# Frontend React (Vite + Ant Design + PWA)

## Stack
- React 19.1.0
- Vite 7.0.5
- Ant Design 5.26.6
- echarts 5.6.0
- echarts-for-react 3.0.2
- lucide-react 0.525.0
- date-fns 4.1.0
- Framer Motion 12.23.6 (animações em todos os componentes interativos)
- PWA (vite-plugin-pwa 1.0.1)
- Internacionalização (i18n)
- Testes automatizados (Vitest 3.2.4)
- Sonner 2.0.6

## Recursos do Dashboard
- Cards de resumo animados (Framer Motion)
- Filtros dinâmicos (canal, mês) que afetam todos os gráficos
- Gráficos interativos (pizza, barra, linha) com ECharts, atualizados em tempo real conforme os filtros
- Animações Framer Motion em menus, modais, botões, badges, cards, etc.

## Estrutura
```
src/
  components/    # Componentes visuais (ui, Sidebar, Navbar, etc.)
  context/       # Contextos globais (ex: AuthContext)
  hooks/         # Hooks customizados (ex: useAuth, useUsuarios)
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