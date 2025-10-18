// src/hooks/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🚀 AuthContext: Iniciando inicialização...');
      let localStorageUser = null;
      
      try {
        // Primeiro, verificar se há dados no localStorage imediatamente
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          try {
            localStorageUser = JSON.parse(storedUser);
            console.log('📦 AuthContext: Usuário encontrado no localStorage:', localStorageUser.email);
            setUser(localStorageUser);
            setIsAuthenticated(true);
            // Não finalizar o loading ainda, continuar com a verificação do authService
          } catch (parseError) {
            console.error('❌ AuthContext: Erro ao parsear usuário do localStorage:', parseError);
            localStorage.removeItem('currentUser');
          }
        }

        // Aguardar a inicialização do authService
        console.log('⏳ AuthContext: Aguardando authService...');
        await authService.waitForInitialization();
        console.log('✅ AuthContext: authService inicializado');
        
        const currentUser = authService.getCurrentUser();
        console.log('👤 AuthContext: Usuário atual do authService:', currentUser?.email || 'NENHUM');
        
        if (currentUser) {
          console.log('🔐 AuthContext: Atualizando com usuário do authService');
          setUser(currentUser);
          setIsAuthenticated(true);
        } else if (!localStorageUser) {
          // Só limpar o estado se NÃO havia usuário no localStorage
          console.log('❌ AuthContext: Nenhum usuário encontrado em lugar algum');
          setUser(null);
          setIsAuthenticated(false);
        } else {
          // Se havia usuário no localStorage mas não no authService, manter o localStorage
          console.log('🔄 AuthContext: Mantendo usuário do localStorage (authService falhou)');
          // O estado já foi definido acima, não fazer nada
        }
      } catch (error) {
        console.error('💥 AuthContext: Erro ao inicializar autenticação:', error);
        // Em caso de erro, se há usuário no localStorage, mantê-lo
        if (localStorageUser) {
          console.log('🛡️ AuthContext: Mantendo usuário do localStorage devido ao erro');
          setUser(localStorageUser);
          setIsAuthenticated(true);
        }
      } finally {
        console.log('🏁 AuthContext: Finalizando loading...');
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      setIsAuthenticated(true);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};