
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import BaseLayout from './layouts/BaseLayout';

// Lazy loading das páginas
const Home = lazy(() => import('./pages/Home'));
const Usuario = lazy(() => import('./pages/Usuario'));
const Perfil = lazy(() => import('./pages/Perfil'));
const Permissao = lazy(() => import('./pages/Permissao'));

// Lazy loading dos novos dashboards
const DashboardFinanceiro = lazy(() => import('./pages/DashboardFinanceiro'));
const DashboardVendas = lazy(() => import('./pages/DashboardVendas'));
const DashboardClientes = lazy(() => import('./pages/DashboardClientes'));
const DashboardOperacional = lazy(() => import('./pages/DashboardOperacional'));

// Componente de loading para Suspense
const PageLoading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px' 
  }}>
    <div>Carregando...</div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <BaseLayout>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/usuarios" element={<Usuario />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/permissao" element={<Permissao />} />
            
            {/* Novos Dashboards Específicos */}
            <Route path="/dashboard/financeiro" element={<DashboardFinanceiro />} />
            <Route path="/dashboard/vendas" element={<DashboardVendas />} />
            <Route path="/dashboard/clientes" element={<DashboardClientes />} />
            <Route path="/dashboard/operacional" element={<DashboardOperacional />} />
          </Routes>
        </Suspense>
      </BaseLayout>
    </BrowserRouter>
  );
}
