
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import BaseLayout from './layouts/BaseLayout';
import PrivateRoute from './components/PrivateRoute';
import SetupWizard from './pages/SetupWizard';

// Lazy loading das páginas
const Login = lazy(() => import('./pages/Login'));
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
  const [appName, setAppName] = useState('BASE');
  const [showWizard, setShowWizard] = useState(false);
  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/health')
      .then(res => res.json())
      .then(data => {
        if (data && data.environment) setAppName(data.environment);
        // Exemplo: se não houver configuração, mostrar wizard
        if (data && data.status === 'setup_required') setShowWizard(true);
      })
      .catch(() => setShowWizard(true));
  }, []);
  if (showWizard) {
    return <SetupWizard />;
  }
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <div style={{padding: 8, fontWeight: 'bold'}}>{appName} | <Link to="/setup">Configuração Inicial</Link></div>
        <Routes>
          {/* Rota pública de login */}
          <Route path="/login" element={<Login />} />
          <Route path="/setup" element={<SetupWizard />} />
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
