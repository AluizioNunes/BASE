import { useState } from 'react';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: string;
}

const usuariosMock: Usuario[] = [
  { id: 1, nome: 'Renata F.', email: 'renata@email.com', perfil: 'Administrador' },
  { id: 2, nome: 'João Silva', email: 'joao@email.com', perfil: 'Usuário' },
  { id: 3, nome: 'Maria Souza', email: 'maria@email.com', perfil: 'Usuário' },
];

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosMock);
  // Aqui você pode adicionar funções para adicionar, editar, remover usuários, etc.
  return { usuarios, setUsuarios };
} 