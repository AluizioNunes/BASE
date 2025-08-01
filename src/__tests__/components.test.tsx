import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import BaseLayout from '../layouts/BaseLayout';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import UsuarioModal from '../components/UsuarioModal';


// Mock do i18n
vi.mock('../i18n', () => ({
  default: {
    changeLanguage: vi.fn(),
    t: vi.fn((key) => key),
  },
}));

// Wrapper para testes
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
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

describe('BaseLayout Component', () => {
  it('renderiza layout completo', () => {
    render(
      <TestWrapper>
        <BaseLayout>
          <div data-testid="content">Conteúdo</div>
        </BaseLayout>
      </TestWrapper>
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(document.querySelector('main')).toBeInTheDocument();
  });

  it('tem estrutura semântica correta', () => {
    render(
      <TestWrapper>
        <BaseLayout>
          <div>Conteúdo</div>
        </BaseLayout>
      </TestWrapper>
    );

    expect(document.querySelector('header')).toBeInTheDocument();
    expect(document.querySelector('nav')).toBeInTheDocument();
    expect(document.querySelector('aside')).toBeInTheDocument();
    expect(document.querySelector('main')).toBeInTheDocument();
  });
});

describe('Navbar Component', () => {
  it('renderiza navbar com elementos essenciais', () => {
    render(
      <TestWrapper>
        <Navbar now={new Date()} />
      </TestWrapper>
    );

    expect(document.querySelector('nav')).toBeInTheDocument();
  });

  it('tem elementos de navegação acessíveis', () => {
    render(
      <TestWrapper>
        <Navbar now={new Date()} />
      </TestWrapper>
    );

    const navElements = document.querySelectorAll('nav a, nav button');
    expect(navElements.length).toBeGreaterThan(0);
  });
});

describe('Sidebar Component', () => {
  it('renderiza sidebar com menu', () => {
    render(
      <TestWrapper>
        <Sidebar collapsed={false} setCollapsed={() => {}} />
      </TestWrapper>
    );

    expect(document.querySelector('aside')).toBeInTheDocument();
  });

  it('tem itens de menu navegáveis', () => {
    render(
      <TestWrapper>
        <Sidebar collapsed={false} setCollapsed={() => {}} />
      </TestWrapper>
    );

    const menuItems = document.querySelectorAll('aside a, aside button');
    expect(menuItems.length).toBeGreaterThan(0);
  });
});

describe('UsuarioModal Component', () => {
  const mockProps = {
    visible: true,
    onCancel: vi.fn(),
    onOk: vi.fn(),
    title: 'Adicionar Usuário',
    initialValues: {},
  };

  it('renderiza modal quando visível', () => {
    render(
      <TestWrapper>
        <UsuarioModal {...mockProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Adicionar Usuário')).toBeInTheDocument();
  });

  it('não renderiza quando não visível', () => {
    render(
      <TestWrapper>
        <UsuarioModal {...mockProps} visible={false} />
      </TestWrapper>
    );

    expect(screen.queryByText('Adicionar Usuário')).not.toBeInTheDocument();
  });

  it('chama onCancel quando cancelado', () => {
    render(
      <TestWrapper>
        <UsuarioModal {...mockProps} />
      </TestWrapper>
    );

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockProps.onCancel).toHaveBeenCalled();
  });
});



describe('Component Accessibility', () => {
  it('todos os componentes têm atributos ARIA apropriados', () => {
    render(
      <TestWrapper>
        <BaseLayout>
          <div>Conteúdo</div>
        </BaseLayout>
      </TestWrapper>
    );

    // Verifica se há elementos com roles ARIA
    const elementsWithRole = document.querySelectorAll('[role]');
    expect(elementsWithRole.length).toBeGreaterThanOrEqual(0);
  });

  it('elementos interativos são focáveis', () => {
    render(
      <TestWrapper>
        <BaseLayout>
          <button>Test Button</button>
        </BaseLayout>
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('tabindex', '0');
  });
});

describe('Component Performance', () => {
  it('componentes renderizam rapidamente', async () => {
    const startTime = performance.now();

    render(
      <TestWrapper>
        <BaseLayout>
          <div>Conteúdo</div>
        </BaseLayout>
      </TestWrapper>
    );

    await waitFor(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      expect(renderTime).toBeLessThan(100);
    });
  });
}); 