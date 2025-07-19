import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

function sanitize(str: string) {
  // Remove tags HTML e caracteres perigosos
  return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default function Home() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.info('Logout realizado!');
  };

  return (
    <div>
      <h1>
        Bem-vindo
        {user ? `, ${sanitize(user.name || user.email)}` : ''}!
      </h1>
      {user && <button onClick={handleLogout}>Sair</button>}
    </div>
  );
} 