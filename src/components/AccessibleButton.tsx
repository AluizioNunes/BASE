import React from 'react';
import { Button, type ButtonProps } from 'antd';
import { motion } from 'framer-motion';

interface AccessibleButtonProps extends ButtonProps {
  /** Descrição para leitores de tela */
  ariaDescription?: string;
  /** Indica se o botão está carregando */
  loading?: boolean;
  /** Texto alternativo para o ícone */
  iconAlt?: string;
  /** Indica se o botão é importante para navegação */
  isNavigation?: boolean;
  /** Função chamada quando o botão recebe foco */
  onFocus?: () => void;
  /** Função chamada quando o botão perde foco */
  onBlur?: () => void;
}

const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  ariaDescription,
  loading = false,
  iconAlt,
  isNavigation = false,
  onFocus,
  onBlur,
  disabled,
  type = 'default',
  size = 'middle',
  className = '',
  ...props
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Gera ID único para associação com aria-describedby
  const descriptionId = React.useId();

  // Atributos ARIA para acessibilidade
  const ariaAttributes = {
    'aria-describedby': ariaDescription ? descriptionId : undefined,
    'aria-label': props['aria-label'] || (iconAlt ? `${children} ${iconAlt}` : undefined),
    'aria-pressed': props['aria-pressed'],
    'aria-expanded': props['aria-expanded'],
    'aria-haspopup': props['aria-haspopup'],
    'aria-controls': props['aria-controls'],
    'aria-current': isNavigation ? ('page' as const) : undefined,
    'role': props.role || (isNavigation ? 'button' : undefined),
    'tabIndex': disabled ? -1 : 0,
  };

  // Remove atributos undefined
  Object.keys(ariaAttributes).forEach(key => {
    if (ariaAttributes[key as keyof typeof ariaAttributes] === undefined) {
      delete ariaAttributes[key as keyof typeof ariaAttributes];
    }
  });

  return (
    <>
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        transition={{ duration: 0.1 }}
      >
        <Button
          ref={buttonRef}
          type={type}
          size={size}
          loading={loading}
          disabled={disabled}
          className={`accessible-button ${className}`}
          onFocus={(e) => {
            // Adiciona outline visual para navegação por teclado
            e.target.style.outline = '2px solid #1890ff';
            e.target.style.outlineOffset = '2px';
            onFocus?.();
          }}
          onBlur={(e) => {
            // Remove outline quando perde foco
            e.target.style.outline = '';
            e.target.style.outlineOffset = '';
            onBlur?.();
          }}
          onKeyDown={(e) => {
            // Suporte para Enter e Space
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (!disabled && !loading) {
                e.currentTarget.click();
              }
            }
          }}
          {...ariaAttributes}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
      
      {/* Descrição para leitores de tela */}
      {ariaDescription && (
        <div
          id={descriptionId}
          className="sr-only"
          aria-live="polite"
        >
          {ariaDescription}
        </div>
      )}
      
      <style>{`
        .accessible-button {
          position: relative;
          transition: all 0.2s ease;
        }
        
        .accessible-button:focus-visible {
          outline: 2px solid #1890ff !important;
          outline-offset: 2px !important;
        }
        
        .accessible-button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
        
        .accessible-button:disabled:hover {
          transform: none !important;
        }
        
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        /* Melhora contraste para diferentes tipos de botão */
        .accessible-button.ant-btn-primary {
          background-color: #1890ff;
          border-color: #1890ff;
          color: #ffffff;
        }
        
        .accessible-button.ant-btn-primary:hover {
          background-color: #40a9ff;
          border-color: #40a9ff;
        }
        
        .accessible-button.ant-btn-default {
          background-color: #ffffff;
          border-color: #d9d9d9;
          color: rgba(0, 0, 0, 0.85);
        }
        
        .accessible-button.ant-btn-default:hover {
          border-color: #40a9ff;
          color: #40a9ff;
        }
        
        /* Melhora contraste para botões desabilitados */
        .accessible-button:disabled {
          background-color: #f5f5f5;
          border-color: #d9d9d9;
          color: rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </>
  );
};

export default AccessibleButton; 