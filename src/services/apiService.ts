// services/apiService.ts
// Serviço para comunicação com a API backend segura

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_SECRET_KEY = import.meta.env.VITE_API_SECRET_KEY || 'humaniq_api_secret_2025_secure_key_v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface ConviteEmpresa {
  nome_empresa: string;
  email_contato: string;
  admin_id: string;
}

interface ConviteColaborador {
  empresa_id: string;
  email_colaborador: string;
  nome_colaborador?: string;
  cargo?: string;
}

interface ConviteResponse {
  id: string;
  token: string;
  nome_empresa?: string;
  email_contato?: string;
  email_colaborador?: string;
  nome_colaborador?: string;
  cargo?: string;
  validade: string;
  status: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_SECRET_KEY,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error(`Erro na requisição para ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido na API'
      };
    }
  }

  // Health check da API
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.makeRequest('/health');
  }

  // Criar convite de empresa
  async criarConviteEmpresa(dados: ConviteEmpresa): Promise<ApiResponse<ConviteResponse>> {
    return this.makeRequest('/api/invitations/empresa', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  }

  // Criar convite de colaborador
  async criarConviteColaborador(dados: ConviteColaborador): Promise<ApiResponse<ConviteResponse>> {
    return this.makeRequest('/api/invitations/colaborador', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  }

  // Buscar convite por token
  async buscarConvitePorToken(token: string): Promise<ApiResponse<ConviteResponse>> {
    return this.makeRequest(`/api/invitations/token/${token}`);
  }

  // Listar convites
  async listarConvites(
    tipo?: 'empresa' | 'colaborador',
    limite?: number,
    offset?: number
  ): Promise<ApiResponse<ConviteResponse[]>> {
    const params = new URLSearchParams();
    if (tipo) params.append('tipo', tipo);
    if (limite) params.append('limite', limite.toString());
    if (offset) params.append('offset', offset.toString());

    const queryString = params.toString();
    const endpoint = `/api/invitations/list${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }
}

export const apiService = new ApiService();
export type { ConviteEmpresa, ConviteColaborador, ConviteResponse, ApiResponse };