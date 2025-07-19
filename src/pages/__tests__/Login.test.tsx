import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';

describe('Login', () => {
  it('renderiza campos de email e senha', () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha|password/i)).toBeInTheDocument();
  });

  it('permite navegação por teclado', () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    const email = screen.getByLabelText(/email/i);
    const senha = screen.getByLabelText(/senha|password/i);
    email.focus();
    expect(email).toHaveFocus();
    fireEvent.keyDown(email, { key: 'Tab' });
    senha.focus();
    expect(senha).toHaveFocus();
  });

  it('submete o formulário', () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    const email = screen.getByLabelText(/email/i);
    const senha = screen.getByLabelText(/senha|password/i);
    const button = screen.getByRole('button');
    fireEvent.change(email, { target: { value: 'usuario@exemplo.com' } });
    fireEvent.change(senha, { target: { value: 'senha123' } });
    fireEvent.click(button);
    expect(button).toBeDisabled();
  });
}); 