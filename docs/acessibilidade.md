# Acessibilidade no Frontend

## Recomendações
- Use sempre tags semânticas do HTML (`<header>`, `<nav>`, `<main>`, `<footer>`, etc)
- Adicione atributos `aria-*` quando necessário
- Garanta contraste adequado de cores
- Forneça textos alternativos (`alt`) para imagens
- Certifique-se de que todos os elementos interativos são acessíveis via teclado
- Utilize labels associadas a inputs
- Teste com leitores de tela

## Exemplo de componente acessível
```tsx
<button aria-label="Fechar modal" onClick={onClose}>
  <span aria-hidden="true">&times;</span>
</button>
```

## Ferramentas úteis
- [axe](https://www.deque.com/axe/): extensão para Chrome/Firefox
- [Lighthouse](https://developers.google.com/web/tools/lighthouse): auditoria de acessibilidade
- [React a11y](https://github.com/reactjs/react-a11y): plugin para detectar problemas em tempo real 