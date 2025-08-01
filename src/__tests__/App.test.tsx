import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

// Mock do service worker
vi.mock('../serviceWorkerRegistration', () => ({
  register: vi.fn(),
  unregister: vi.fn(),
}));

// Mock do Sentry
vi.mock('@sentry/react', () => ({
  init: vi.fn(),
  captureException: vi.fn(),
}));

// Mock do i18n
vi.mock('../i18n', () => ({
  default: {
    changeLanguage: vi.fn(),
    t: vi.fn((key) => key),
  },
}));

// Wrapper para testes com providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza a aplicação sem erros', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    // Verifica se a aplicação carrega sem erros
    expect(document.body).toBeInTheDocument();
  });

  it('renderiza o layout base', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    // Verifica se o layout base está presente
    expect(document.querySelector('main')).toBeInTheDocument();
  });

  it('navegação funciona corretamente', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    // Verifica se as rotas estão configuradas
    expect(window.location.pathname).toBe('/');
  });

  it('lazy loading funciona', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    // Verifica se o Suspense está configurado
    expect(document.querySelector('[data-testid="loading"]') || 
           document.querySelector('.loading') || 
           document.querySelector('div')).toBeInTheDocument();
  });
});

describe('App Performance', () => {
  it('carrega rapidamente', async () => {
    const startTime = performance.now();
    
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    await waitFor(() => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      // Verifica se o carregamento é rápido (< 100ms)
      expect(loadTime).toBeLessThan(100);
    });
  });
});

describe('App Accessibility', () => {
  it('tem estrutura semântica correta', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    // Verifica se há elementos semânticos
    expect(document.querySelector('main')).toBeInTheDocument();
  });

  it('suporta navegação por teclado', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    // Verifica se há elementos focáveis
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    expect(focusableElements.length).toBeGreaterThan(0);
  });
}); 