import { createContext, useContext, useState, useEffect } from "react";
import { 
  getProfile, 
  loginUser, 
  logoutUser, 
  registerUser, 
  requestPasswordReset,
  confirmPasswordReset,
  validatePassword,
  setupMFA,
  verifyMFASetup,
  loginMFA,
  refreshToken
} from '../services/api';

interface User {
  id: number;
  email: string;
  name: string;
  perfil: string;
  funcao: string;
  usuario: string;
  mfa_enabled: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<{ success: boolean; requiresMFA?: boolean; user?: User }>;
  loginMFA: (code: string) => Promise<{ success: boolean; user?: User }>;
  register: (data: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message?: string }>;
  confirmPasswordReset: (token: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  validatePassword: (password: string) => Promise<{ valid: boolean; errors: string[]; warnings: string[]; score: number }>;
  setupMFA: () => Promise<{ success: boolean; code?: string; message?: string }>;
  verifyMFASetup: (code: string) => Promise<{ success: boolean; message?: string }>;
  refreshUserToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Checa autenticação ao iniciar o app
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch (error) {
      // Tenta refresh token se falhar
      const refreshed = await refreshUserToken();
      if (!refreshed) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: { email: string; password: string }) => {
    try {
      const response = await loginUser(data);
      
      if (response.requires_mfa) {
        return { success: true, requiresMFA: true };
      }
      
      if (response.user) {
        setUser(response.user);
        return { success: true, user: response.user };
      }
      
      return { success: false };
    } catch (error: any) {
      console.error('Erro no login:', error);
      return { success: false };
    }
  };

  const loginMFA = async (code: string): Promise<{ success: boolean; user?: User }> => {
    try {
      const mfaResponse = await loginMFA(code);
      if (mfaResponse.user) {
        setUser(mfaResponse.user);
        return { success: true, user: mfaResponse.user };
      }
      return { success: false };
    } catch (error: any) {
      console.error('Erro no login MFA:', error);
      return { success: false };
    }
  };

  const register = async (data: any) => {
    try {
      const response = await registerUser(data);
      return { success: true, message: response.message };
    } catch (error: any) {
      console.error('Erro no registro:', error);
      return { success: false, message: error.response?.data?.detail || 'Erro no registro' };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
      // Força logout mesmo com erro
      setUser(null);
    }
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const resetResponse = await requestPasswordReset(email);
      return { success: true, message: resetResponse.message };
    } catch (error: any) {
      console.error('Erro ao solicitar reset:', error);
      return { success: false, message: error.response?.data?.detail || 'Erro ao solicitar reset' };
    }
  };

  const confirmPasswordReset = async (token: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const confirmResponse = await confirmPasswordReset(token, newPassword);
      return { success: true, message: confirmResponse.message };
    } catch (error: any) {
      console.error('Erro ao confirmar reset:', error);
      return { success: false, message: error.response?.data?.detail || 'Erro ao confirmar reset' };
    }
  };

  const validatePassword = async (password: string): Promise<{ valid: boolean; errors: string[]; warnings: string[]; score: number }> => {
    try {
      const validationResponse = await validatePassword(password);
      return validationResponse;
    } catch (error: any) {
      console.error('Erro na validação de senha:', error);
      return { valid: false, errors: ['Erro na validação'], warnings: [], score: 0 };
    }
  };

  const setupMFA = async (): Promise<{ success: boolean; code?: string; message?: string }> => {
    try {
      const mfaResponse = await setupMFA();
      return { success: true, code: mfaResponse.mfa_code, message: mfaResponse.message };
    } catch (error: any) {
      console.error('Erro ao configurar MFA:', error);
      return { success: false, message: error.response?.data?.detail || 'Erro ao configurar MFA' };
    }
  };

  const verifyMFASetup = async (code: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const verifyResponse = await verifyMFASetup(code);
      // Atualiza usuário com MFA habilitado
      if (user) {
        setUser({ ...user, mfa_enabled: true });
      }
      return { success: true, message: verifyResponse.message };
    } catch (error: any) {
      console.error('Erro ao verificar MFA:', error);
      return { success: false, message: error.response?.data?.detail || 'Erro ao verificar MFA' };
    }
  };

  const refreshUserToken = async () => {
    try {
      const response = await refreshToken();
      if (response.access_token) {
        // Recarrega perfil do usuário
        const profile = await getProfile();
        setUser(profile);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    loginMFA,
    register,
    logout,
    requestPasswordReset,
    confirmPasswordReset,
    validatePassword,
    setupMFA,
    verifyMFASetup,
    refreshUserToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
  }
  return context;
} 