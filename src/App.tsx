
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BaseLayout from './layouts/BaseLayout';
import Home from './pages/Home';
import Usuario from './pages/Usuario';
import Perfil from './pages/Perfil';
import Permissao from './pages/Permissao';

export default function App() {
  return (
    <BrowserRouter>
      <BaseLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/usuarios" element={<Usuario />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/permissao" element={<Permissao />} />
        </Routes>
      </BaseLayout>
    </BrowserRouter>
  );
}
