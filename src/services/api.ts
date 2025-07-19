import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor de resposta para tratamento global de erros
api.interceptors.response.use(
  response => response,
  error => {
    // Aqui pode-se integrar com Toast ou Sentry
    // Exemplo: console.error(error.response?.data?.detail || error.message);
    return Promise.reject(error);
  }
);

export async function loginUser(data: { email: string; password: string }) {
  const response = await api.post('/auth/login', data);
  return response.data;
}

export async function getProfile() {
  const response = await api.get('/auth/profile', { withCredentials: true });
  return response.data;
}

export async function logoutUser() {
  const response = await api.post('/auth/logout', {}, { withCredentials: true });
  return response.data;
} 