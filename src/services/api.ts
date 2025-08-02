import axios, { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || "http://10.10.255.111/api/v1";

// Configuração base da API
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requisições
api.interceptors.request.use(
  (config) => {
    // Adiciona timestamp para cache busting em desenvolvimento
    if (import.meta.env.DEV) {
      config.params = { ...config.params, _t: Date.now() };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respostas
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const message = (error.response?.data as { detail?: string })?.detail || error.message;

    // Tratamento de erros específicos
    switch (status) {
      case 401:
        // Redirecionar para login se não autenticado
        window.location.href = '/login';
        break;
      case 403:
        toast.error('Acesso negado. Você não tem permissão para esta ação.');
        break;
      case 404:
        toast.error('Recurso não encontrado.');
        break;
      case 422:
        toast.error('Dados inválidos. Verifique as informações enviadas.');
        break;
      case 500:
        toast.error('Erro interno do servidor. Tente novamente mais tarde.');
        break;
      default:
        if (error.code === 'ECONNABORTED') {
          toast.error('Tempo limite excedido. Verifique sua conexão.');
        } else {
          toast.error(`Erro: ${message}`);
        }
    }

    return Promise.reject(error);
  }
);

// Tipos para respostas da API
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Interfaces para autenticação
export interface LoginRequest {
  email_or_username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user?: {
    id: number;
    email: string;
    name: string;
    perfil: string;
    funcao: string;
    usuario: string;
    mfa_enabled: boolean;
  };
  requires_mfa?: boolean;
}

export interface RegisterRequest {
  nome: string;
  cpf: string;
  funcao: string;
  email: string;
  usuario: string;
  password: string;
  perfil: string;
  cadastrante: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  name: string;
  message: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
  token?: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
}

export interface PasswordValidationResponse {
  valid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
}

export interface MFARequest {
  code: string;
}

export interface MFASetupResponse {
  mfa_code: string;
  message: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

// Funções utilitárias da API
export const apiUtils = {
  // GET com cache
  async get<T>(url: string, useCache = false): Promise<T> {
    const config = useCache ? { headers: { 'Cache-Control': 'max-age=300' } } : {};
    const response = await api.get<T>(url, config);
    return response.data;
  },

  // POST com validação
  async post<T>(url: string, data: unknown): Promise<T> {
    const response = await api.post<T>(url, data);
    return response.data;
  },

  // PUT
  async put<T>(url: string, data: unknown): Promise<T> {
    const response = await api.put<T>(url, data);
    return response.data;
  },

  // DELETE
  async delete<T>(url: string): Promise<T> {
    const response = await api.delete<T>(url);
    return response.data;
  },

  // Upload de arquivo
  async upload<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  },
};

// Funções de autenticação
export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', data);
  return response.data;
}

export async function loginMFA(code: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login/mfa', { code });
  return response.data;
}

export async function getProfile() {
  const response = await api.get('/auth/profile');
  return response.data;
}

export async function logoutUser() {
  const response = await api.post('/auth/logout');
  return response.data;
}

export async function registerUser(data: RegisterRequest): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>('/auth/register', data);
  return response.data;
}

export async function requestPasswordReset(email: string): Promise<PasswordResetResponse> {
  const response = await api.post<PasswordResetResponse>('/auth/password/reset', { email });
  return response.data;
}

export async function confirmPasswordReset(token: string, newPassword: string): Promise<{ message: string }> {
  const response = await api.post('/auth/password/reset/confirm', { token, new_password: newPassword });
  return response.data;
}

export async function validatePassword(password: string): Promise<PasswordValidationResponse> {
  const response = await api.post<PasswordValidationResponse>('/auth/password/validate', { password });
  return response.data;
}

export async function setupMFA(): Promise<MFASetupResponse> {
  const response = await api.post<MFASetupResponse>('/auth/mfa/setup');
  return response.data;
}

export async function verifyMFASetup(code: string): Promise<{ message: string }> {
  const response = await api.post('/auth/mfa/verify', { code });
  return response.data;
}

export async function refreshToken(): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>('/auth/refresh', { refresh_token: 'from_cookie' });
  return response.data;
}

export async function getLoginAudit(limit: number = 50) {
  const response = await api.get(`/auth/audit/login?limit=${limit}`);
  return response.data;
}

export default api; 