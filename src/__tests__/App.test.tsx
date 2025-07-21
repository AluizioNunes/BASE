import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('renderiza página principal', () => {
  it('renderiza página principal', () => {
    render(<App />);
    expect(screen.getByText(/Learn React/i)).toBeInTheDocument();
  });
}); 