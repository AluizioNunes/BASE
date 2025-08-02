import { createContext, useContext, useState, useEffect } from "react";
import { 
  getProfile, 
  loginUser, 
  logoutUser, 
  registerUser, 
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
  register: (data: any) => Promise<{ success: boolean; message?: string }>;
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

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
  }
  return context;
} 