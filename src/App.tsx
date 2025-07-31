
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import BaseLayout from './layouts/BaseLayout';

// Lazy loading das páginas
const Home = lazy(() => import('./pages/Home'));
const Usuario = lazy(() => import('./pages/Usuario'));
const Perfil = lazy(() => import('./pages/Perfil'));
const Permissao = lazy(() => import('./pages/Permissao'));

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
          </Routes>
        </Suspense>
      </BaseLayout>
    </BrowserRouter>
  );
}
