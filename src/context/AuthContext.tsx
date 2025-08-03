import { createContext, useState, useEffect } from "react";
import { 
  getProfile, 
  loginUser, 
  logoutUser, 
  registerUser, 
  refreshToken
} from '../services/api';
import type { RegisterRequest } from '../services/api';

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
  login: (data: { email_or_username: string; password: string }) => Promise<{ success: boolean; requiresMFA?: boolean; user?: User }>;
  loginDev: () => Promise<{ success: boolean; user?: User }>;
  register: (data: RegisterRequest) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
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
      // Verifica se há token antes de tentar buscar perfil
      const hasToken = document.cookie.includes('access_token');
      if (!hasToken) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      const profile = await getProfile();
      setUser(profile);
    } catch {
      // Tenta refresh token se falhar
      const refreshed = await refreshUserToken();
      if (!refreshed) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: { email_or_username: string; password: string }) => {
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
    } catch (error: unknown) {
      console.error('Erro no login:', error);
      return { success: false };
    }
  };

  const loginDev = async () => {
    try {
      // Usuário de desenvolvimento simulado
      const devUser: User = {
        id: 999,
        email: "dev@localhost",
        name: "Desenvolvedor",
        perfil: "Administrador",
        funcao: "Desenvolvedor",
        usuario: "DEV",
        mfa_enabled: false
      };
      
      setUser(devUser);
      return { success: true, user: devUser };
    } catch (error: unknown) {
      console.error('Erro no login de desenvolvimento:', error);
      return { success: false };
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await registerUser(data);
      return { success: true, message: response.message };
    } catch (error: unknown) {
      console.error('Erro no registro:', error);
      return { success: false, message: 'Erro no registro' };
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
    loginDev,
    register,
    logout,
    refreshUserToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext }; 