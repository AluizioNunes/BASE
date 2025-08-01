import { useEffect, useRef, useState, useCallback } from 'react';

interface UseAccessibilityOptions {
  /** Indica se deve gerenciar foco automaticamente */
  manageFocus?: boolean;
  /** Indica se deve gerenciar navegação por teclado */
  manageKeyboard?: boolean;
  /** Indica se deve gerenciar anúncios para leitores de tela */
  manageAnnouncements?: boolean;
  /** Indica se deve gerenciar contraste */
  manageContrast?: boolean;
}

interface AccessibilityAnnouncement {
  id: string;
  message: string;
  priority: 'polite' | 'assertive';
  timestamp: number;
}

export const useAccessibility = (options: UseAccessibilityOptions = {}) => {
  const {
    manageFocus = true,
    manageKeyboard = true,
    manageAnnouncements = true,
    manageContrast = true,
  } = options;

  const [announcements, setAnnouncements] = useState<AccessibilityAnnouncement[]>([]);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const focusTrapRef = useRef<HTMLDivElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  // Detecta preferências de acessibilidade do usuário
  useEffect(() => {
    const mediaQueryHighContrast = window.matchMedia('(prefers-contrast: high)');
    const mediaQueryReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    setIsHighContrast(mediaQueryHighContrast.matches);
    setIsReducedMotion(mediaQueryReducedMotion.matches);

    mediaQueryHighContrast.addEventListener('change', handleHighContrastChange);
    mediaQueryReducedMotion.addEventListener('change', handleReducedMotionChange);

    return () => {
      mediaQueryHighContrast.removeEventListener('change', handleHighContrastChange);
      mediaQueryReducedMotion.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  // Gerenciamento de foco
  const trapFocus = useCallback((container: HTMLElement) => {
    if (!manageFocus) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [manageFocus]);

  // Salva o último elemento focado
  const saveLastFocusedElement = useCallback(() => {
    if (!manageFocus) return;
    lastFocusedElement.current = document.activeElement as HTMLElement;
  }, [manageFocus]);

  // Restaura o foco para o último elemento
  const restoreFocus = useCallback(() => {
    if (!manageFocus || !lastFocusedElement.current) return;
    lastFocusedElement.current.focus();
  }, [manageFocus]);

  // Gerenciamento de anúncios para leitores de tela
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!manageAnnouncements) return;

    const announcement: AccessibilityAnnouncement = {
      id: `announcement-${Date.now()}`,
      message,
      priority,
      timestamp: Date.now(),
    };

    setAnnouncements(prev => [...prev, announcement]);

    // Remove anúncios antigos após 5 segundos
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== announcement.id));
    }, 5000);
  }, [manageAnnouncements]);

  // Gerenciamento de navegação por teclado
  const handleKeyboardNavigation = useCallback((e: KeyboardEvent, handlers: {
    onEnter?: () => void;
    onSpace?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
  }) => {
    if (!manageKeyboard) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        handlers.onEnter?.();
        break;
      case ' ':
        e.preventDefault();
        handlers.onSpace?.();
        break;
      case 'Escape':
        e.preventDefault();
        handlers.onEscape?.();
        break;
      case 'ArrowUp':
        e.preventDefault();
        handlers.onArrowUp?.();
        break;
      case 'ArrowDown':
        e.preventDefault();
        handlers.onArrowDown?.();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handlers.onArrowLeft?.();
        break;
      case 'ArrowRight':
        e.preventDefault();
        handlers.onArrowRight?.();
        break;
    }
  }, [manageKeyboard]);

  // Verifica se um elemento está visível na tela
  const isElementVisible = useCallback((element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.visibility !== 'hidden' &&
      style.display !== 'none' &&
      style.opacity !== '0'
    );
  }, []);

  // Encontra o próximo elemento focável
  const findNextFocusableElement = useCallback((currentElement: HTMLElement): HTMLElement | null => {
    const allFocusable = Array.from(
      document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    const currentIndex = allFocusable.indexOf(currentElement);
    const visibleFocusable = allFocusable.filter(isElementVisible);

    if (currentIndex === -1) {
      return visibleFocusable[0] || null;
    }

    const nextIndex = (currentIndex + 1) % visibleFocusable.length;
    return visibleFocusable[nextIndex] || null;
  }, [isElementVisible]);

  // Encontra o elemento focável anterior
  const findPreviousFocusableElement = useCallback((currentElement: HTMLElement): HTMLElement | null => {
    const allFocusable = Array.from(
      document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    const currentIndex = allFocusable.indexOf(currentElement);
    const visibleFocusable = allFocusable.filter(isElementVisible);

    if (currentIndex === -1) {
      return visibleFocusable[visibleFocusable.length - 1] || null;
    }

    const prevIndex = currentIndex === 0 ? visibleFocusable.length - 1 : currentIndex - 1;
    return visibleFocusable[prevIndex] || null;
  }, [isElementVisible]);

  // Gerenciamento de contraste
  const toggleHighContrast = useCallback(() => {
    if (!manageContrast) return;

    const root = document.documentElement;
    const newContrast = !isHighContrast;
    
    setIsHighContrast(newContrast);
    
    if (newContrast) {
      root.setAttribute('data-high-contrast', 'true');
      announce('Modo de alto contraste ativado', 'polite');
    } else {
      root.removeAttribute('data-high-contrast');
      announce('Modo de alto contraste desativado', 'polite');
    }
  }, [manageContrast, isHighContrast, announce]);

  // Verifica se o contraste está adequado
  const checkContrast = useCallback((foreground: string, background: string): boolean => {
    // Função simplificada para calcular contraste
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const fg = hexToRgb(foreground);
    const bg = hexToRgb(background);

    if (!fg || !bg) return false;

    const luminance = (r: number, g: number, b: number) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = luminance(fg.r, fg.g, fg.b);
    const l2 = luminance(bg.r, bg.g, bg.b);

    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return ratio >= 4.5; // WCAG AA standard
  }, []);

  // Hook para detectar mudanças de foco
  useEffect(() => {
    if (!manageFocus) return;

    const handleFocusChange = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && target !== lastFocusedElement.current) {
        lastFocusedElement.current = target;
      }
    };

    document.addEventListener('focusin', handleFocusChange);
    return () => document.removeEventListener('focusin', handleFocusChange);
  }, [manageFocus]);

  return {
    // Estado
    announcements,
    isHighContrast,
    isReducedMotion,
    
    // Funções de foco
    trapFocus,
    saveLastFocusedElement,
    restoreFocus,
    findNextFocusableElement,
    findPreviousFocusableElement,
    
    // Funções de anúncio
    announce,
    
    // Funções de navegação
    handleKeyboardNavigation,
    
    // Funções de contraste
    toggleHighContrast,
    checkContrast,
    
    // Utilitários
    isElementVisible,
    focusTrapRef,
  };
};

export default useAccessibility; 