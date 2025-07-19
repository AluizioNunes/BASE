# Acessibilidade no Frontend

## Recomendações
- Use sempre tags semânticas do HTML (`<header>`, `<nav>`, `<main>`, `<footer>`, etc)
- Adicione atributos `aria-*` quando necessário (ex: aria-label, aria-required)
- Garanta contraste adequado de cores
- Forneça textos alternativos (`alt`) para imagens
- Certifique-se de que todos os elementos interativos são acessíveis via teclado
- Utilize labels associadas a inputs (`<label htmlFor="id">`)
- Teste com leitores de tela
- Implemente navegação por Tab e Shift+Tab
- Use autocomplete nos campos de formulário

## Exemplo de componente acessível
```tsx
<form aria-label="Formulário de login">
  <label htmlFor="email">Email</label>
  <input id="email" type="email" autoComplete="username" aria-required="true" />
  <label htmlFor="password">Senha</label>
  <input id="password" type="password" autoComplete="current-password" aria-required="true" />
  <button type="submit">Entrar</button>
</form>
```

## Testes automatizados
- Use `jest-axe` para garantir acessibilidade básica nos testes unitários
- Audite com Lighthouse (Chrome DevTools)

## Ferramentas úteis
- [axe](https://www.deque.com/axe/): extensão para Chrome/Firefox
- [Lighthouse](https://developers.google.com/web/tools/lighthouse): auditoria de acessibilidade
- [React a11y](https://github.com/reactjs/react-a11y): plugin para detectar problemas em tempo real 