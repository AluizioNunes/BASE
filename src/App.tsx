
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import BaseLayout from './layouts/BaseLayout';
import PrivateRoute from './components/PrivateRoute';

// Lazy loading das páginas
const Login = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/Home'));
const Usuario = lazy(() => import('./pages/Usuario'));
const Perfil = lazy(() => import('./pages/Perfil'));
const Permissao = lazy(() => import('./pages/Permissao'));
const Configuracoes = lazy(() => import('./pages/Configuracoes'));

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
      <Suspense fallback={<PageLoading />}>

        <Routes>
          {/* Rota pública de login */}
          <Route path="/login" element={<Login />} />
          {/* Rotas protegidas */}
          <Route path="/" element={
            <PrivateRoute>
              <BaseLayout>
                <Home />
              </BaseLayout>
            </PrivateRoute>
          } />
          
          <Route path="/usuarios" element={
            <PrivateRoute>
              <BaseLayout>
                <Usuario />
              </BaseLayout>
            </PrivateRoute>
          } />
          
          <Route path="/perfil" element={
            <PrivateRoute>
              <BaseLayout>
                <Perfil />
              </BaseLayout>
            </PrivateRoute>
          } />
          
          <Route path="/permissao" element={
            <PrivateRoute>
              <BaseLayout>
                <Permissao />
              </BaseLayout>
            </PrivateRoute>
          } />
          
          <Route path="/configuracoes" element={
            <PrivateRoute>
              <BaseLayout>
                <Configuracoes />
              </BaseLayout>
            </PrivateRoute>
          } />
          
          {/* Novos Dashboards Específicos */}
          <Route path="/dashboard/financeiro" element={
            <PrivateRoute>
              <BaseLayout>
                <DashboardFinanceiro />
              </BaseLayout>
            </PrivateRoute>
          } />
          
          <Route path="/dashboard/vendas" element={
            <PrivateRoute>
              <BaseLayout>
                <DashboardVendas />
              </BaseLayout>
            </PrivateRoute>
          } />
          
          <Route path="/dashboard/clientes" element={
            <PrivateRoute>
              <BaseLayout>
                <DashboardClientes />
              </BaseLayout>
            </PrivateRoute>
          } />
          
          <Route path="/dashboard/operacional" element={
            <PrivateRoute>
              <BaseLayout>
                <DashboardOperacional />
              </BaseLayout>
            </PrivateRoute>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
