import { render, screen } from '@testing-library/react';
import App from '../App';

test('renderiza página principal', () => {
  render(<App />);
  expect(screen.getByText(/Learn React/i)).toBeInTheDocument();
}); 