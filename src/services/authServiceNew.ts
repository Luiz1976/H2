// Novo serviço de autenticação usando a API local
// Usa URL relativa - o Vite faz proxy para localhost:3001
const API_BASE_URL = '';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'empresa' | 'colaborador';
  redirectUrl: string;
  empresaId?: string;
  permissoes?: any;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

class AuthServiceNew {
  private currentUser: User | null = null;
  private token: string | null = null;

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');

    if (storedUser && storedToken) {
      try {
        this.currentUser = JSON.parse(storedUser);
        this.token = storedToken;
      } catch (error) {
        console.error('Erro ao carregar dados de autenticação:', error);
        this.clearAuth();
      }
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
  }

  async registrarAdmin(email: string, nome: string, senha: string): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest<{ token: string; user: any }>('/api/auth/register/admin', {
        method: 'POST',
        body: JSON.stringify({ email, nome, senha }),
      });

      const user: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.nome,
        role: 'admin',
        redirectUrl: '/admin',
      };

      this.currentUser = user;
      this.token = response.token;
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', response.token);

      return { success: true, user, token: response.token };
    } catch (error) {
      console.error('Erro ao registrar admin:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Erro ao registrar administrador'
      };
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest<{ token: string; user: any }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const roleMap: Record<string, string> = {
        admin: '/admin',
        empresa: '/empresa',
        colaborador: '/colaborador',
      };

      const user: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.nome || response.user.name,
        role: response.user.role,
        redirectUrl: roleMap[response.user.role] || '/',
        empresaId: response.user.empresaId,
      };

      this.currentUser = user;
      this.token = response.token;
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', response.token);

      return { success: true, user, token: response.token };
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'E-mail ou senha inválidos'
      };
    }
  }

  async logout(): Promise<void> {
    this.clearAuth();
  }

  private clearAuth(): void {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser && !!this.token;
  }

  hasRole(...roles: ('admin' | 'empresa' | 'colaborador')[]): boolean {
    if (!this.currentUser) return false;
    return roles.includes(this.currentUser.role);
  }

  async getEmpresas(): Promise<{ success: boolean; data?: any[]; message?: string }> {
    try {
      const response = await this.makeRequest<{ empresas: any[]; total: number }>('/api/empresas/todas', {
        method: 'GET',
      });
      return { success: true, data: response.empresas };
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar empresas'
      };
    }
  }
}

export const authServiceNew = new AuthServiceNew();
