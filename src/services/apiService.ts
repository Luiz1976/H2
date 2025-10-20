// Serviço para comunicação com a API backend
// Usa URL relativa - o Vite faz proxy para localhost:3001
const API_BASE_URL = '';

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface ConviteEmpresa {
  nomeEmpresa: string;
  emailContato: string;
  diasValidade?: number;
}

interface ConviteColaborador {
  nome: string;
  email: string;
  cargo?: string;
  departamento?: string;
  diasValidade?: number;
}

interface ConviteResponse {
  id: string;
  token: string;
  nomeEmpresa?: string;
  emailContato?: string;
  email?: string;
  nome?: string;
  cargo?: string;
  departamento?: string;
  validade: string;
  status: string;
  linkConvite?: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  }

  // Health check da API
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.makeRequest('/health');
  }

  // Criar convite de empresa
  async criarConviteEmpresa(dados: ConviteEmpresa): Promise<ConviteResponse> {
    const response = await this.makeRequest<{ convite: ConviteResponse; linkConvite: string }>(
      '/api/convites/empresa',
      {
        method: 'POST',
        body: JSON.stringify(dados),
      }
    );
    return response.convite;
  }

  // Criar convite de colaborador
  async criarConviteColaborador(dados: ConviteColaborador): Promise<ConviteResponse> {
    const response = await this.makeRequest<{ convite: ConviteResponse; linkConvite: string }>(
      '/api/convites/colaborador',
      {
        method: 'POST',
        body: JSON.stringify(dados),
      }
    );
    return response.convite;
  }

  // Buscar convite por token
  async buscarConvitePorToken(token: string, tipo: 'empresa' | 'colaborador'): Promise<ConviteResponse> {
    const response = await this.makeRequest<{ convite: ConviteResponse; tipo: string }>(
      `/api/convites/token/${token}?tipo=${tipo}`
    );
    return response.convite;
  }

  // Aceitar convite de empresa
  async aceitarConviteEmpresa(token: string, senha: string): Promise<{ message: string; empresa: any }> {
    return this.makeRequest(`/api/convites/empresa/aceitar/${token}`, {
      method: 'POST',
      body: JSON.stringify({ senha }),
    });
  }

  // Aceitar convite de colaborador
  async aceitarConviteColaborador(token: string, senha: string): Promise<{ message: string; colaborador: any }> {
    return this.makeRequest(`/api/convites/colaborador/aceitar/${token}`, {
      method: 'POST',
      body: JSON.stringify({ senha }),
    });
  }

  // Listar convites
  async listarConvites(): Promise<{ convites: ConviteResponse[]; tipo: string }> {
    return this.makeRequest('/api/convites/listar');
  }

  // Listar testes disponíveis
  async listarTestes(): Promise<{ testes: any[] }> {
    return this.makeRequest('/api/testes');
  }

  // Obter perguntas de um teste
  async obterPerguntasTeste(testeId: string): Promise<{ perguntas: any[]; total: number }> {
    return this.makeRequest(`/api/testes/${testeId}/perguntas`);
  }

  // Submeter resultado de teste
  async submeterResultadoTeste(dados: {
    testeId: string;
    respostas: Array<{ perguntaId: string; valor: string; pontuacao?: number }>;
    tempoGasto?: number;
    sessionId?: string;
  }): Promise<{ message: string; resultado: any }> {
    return this.makeRequest('/api/testes/resultado', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  }

  // Obter meus resultados
  async obterMeusResultados(): Promise<{ resultados: any[]; total: number }> {
    return this.makeRequest('/api/testes/resultados/meus');
  }

  // Obter dados da empresa
  async obterDadosEmpresa(): Promise<{ empresa: any }> {
    return this.makeRequest('/api/empresas/me');
  }

  // Listar colaboradores da empresa
  async listarColaboradores(): Promise<{ colaboradores: any[]; total: number }> {
    return this.makeRequest('/api/empresas/colaboradores');
  }

  // Obter estatísticas da empresa
  async obterEstatisticasEmpresa(): Promise<{ estatisticas: any }> {
    return this.makeRequest('/api/empresas/estatisticas');
  }
}

export const apiService = new ApiService();
export type { ConviteEmpresa, ConviteColaborador, ConviteResponse, ApiResponse };
