# Componentes Reutilizáveis (UI)

Esta pasta contém componentes de interface reutilizáveis em toda a aplicação.

## Padrão de criação
- Cada componente deve ser criado em um arquivo próprio (ex: `Button.tsx`)
- Componentes podem ser agrupados em subpastas por domínio (ex: `form/`, `layout/`)
- Sempre exporte o componente como default
- Use TypeScript para tipagem de props

## Exemplo
```tsx
// Button.tsx
import React from "react";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};
const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
  <button {...props}>{children}</button>
);
export default Button;
```

## Componentes UI

Coloque aqui os componentes do shadcn/ui customizados em `src/components/ui/`. 