// services/invitationServiceHybrid.ts
// Serviço híbrido que usa API backend segura como principal e Supabase direto como fallback

import { apiService, type ConviteEmpresa as ApiConviteEmpresa, type ConviteColaborador as ApiConviteColaborador, type ConviteResponse } from './apiService';
import { invitationService as originalService, type ConviteEmpresa, type ConviteColaborador, type InvitationResponse, type ConviteData } from './invitationService';
import { type ConviteData as ConviteDataLegacy } from './conviteService';

// ========================================
// INTERFACES UNIFICADAS
// ========================================

export interface HybridInvitationResponse {
  success: boolean;
  message: string;
  data?: any;
  token?: string;
  convite?: ConviteEmpresa | ConviteColaborador;
  source?: 'api' | 'supabase'; // Indica qual fonte foi usada
}

// ========================================
// SERVIÇO HÍBRIDO DE CONVITES
// ========================================

import { supabase } from '../lib/supabase';

class HybridInvitationService {
  async createInvitation(dados: Omit<ConviteDataLegacy, 'id' | 'dataCriacao' | 'status' | 'colaboradoresUsaram' | 'colaboradoresRestantes' | 'codigoConvite'>): Promise<ConviteDataLegacy> {
    const codigo = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const agora = new Date();

    const dataExpiracao = dados.tipoLiberacao === 'prazo' && dados.prazoDias
      ? new Date(agora.getTime() + dados.prazoDias * 24 * 60 * 60 * 1000)
      : null;

    // A tabela correta é 'convites_empresa', não 'convites'
    const { data, error } = await supabase
      .from('convites_empresa')
      .insert([
        {
          token: codigo, // Campo correto é 'token'
          nome_empresa: dados.nomeEmpresa,
          email_contato: dados.emailContato,
          // Removendo campos que não existem na tabela convites_empresa
          status: 'pendente',
          validade: dataExpiracao ? dataExpiracao.toISOString() : null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar convite no Supabase:', error);
      throw new Error('Não foi possível criar o convite.');
    }

    return {
      id: data.id,
      codigoConvite: data.token, // Campo correto é 'token'
      nomeEmpresa: data.nome_empresa,
      emailContato: data.email_contato,
      numeroColaboradores: dados.numeroColaboradores, // Valor do input
      tipoLiberacao: dados.tipoLiberacao,
      prazoDias: dados.prazoDias,
      dataCriacao: new Date(data.created_at),
      dataExpiracao: data.validade ? new Date(data.validade) : undefined,
      status: data.status,
      colaboradoresUsaram: 0, // Valor inicial
      colaboradoresRestantes: dados.numeroColaboradores, // Valor inicial
    };
  }

  
  /**
   * Cria convite para empresa usando API backend (principal) ou Supabase direto (fallback)
   */
  async criarConviteEmpresa(dados: ConviteData): Promise<HybridInvitationResponse> {
    try {
      console.log('🔄 [HYBRID] Tentando criar convite empresa via API backend...');
      
      // Tentar via API backend primeiro
      const apiResponse = await apiService.criarConviteEmpresa({
        nome_empresa: dados.nome,
        email_contato: dados.email,
        admin_id: dados.admin_id!
      });

      if (apiResponse.success && apiResponse.data) {
        console.log('✅ [HYBRID] Convite empresa criado via API backend');
        return {
          success: true,
          message: apiResponse.message || 'Convite criado com sucesso via API',
          token: apiResponse.data.token,
          convite: {
            id: apiResponse.data.id,
            token: apiResponse.data.token,
            nome_empresa: apiResponse.data.nome_empresa,
            email_contato: apiResponse.data.email_contato,
            admin_id: apiResponse.data.admin_id,
            status: apiResponse.data.status,
            validade: apiResponse.data.validade,
            created_at: apiResponse.data.created_at,
            metadados: apiResponse.data.metadados
          },
          source: 'api'
        };
      }

      console.log('⚠️ [HYBRID] API backend falhou, tentando Supabase direto...');
      console.log('🔍 [HYBRID] Erro da API:', apiResponse.error);

      // Fallback para Supabase direto
      const supabaseResponse = await originalService.criarConviteEmpresa(dados);
      
      return {
        ...supabaseResponse,
        source: 'supabase'
      };

    } catch (error) {
      console.error('❌ [HYBRID] Erro em ambas as tentativas:', error);
      
      // Último recurso: tentar Supabase direto
      try {
        const supabaseResponse = await originalService.criarConviteEmpresa(dados);
        return {
          ...supabaseResponse,
          source: 'supabase'
        };
      } catch (fallbackError) {
        console.error('❌ [HYBRID] Fallback também falhou:', fallbackError);
        return {
          success: false,
          message: 'Erro em todos os métodos de criação de convite',
          source: 'api'
        };
      }
    }
  }

  /**
   * Cria convite para colaborador usando API backend (principal) ou Supabase direto (fallback)
   */
  async criarConviteColaborador(dados: ConviteData): Promise<HybridInvitationResponse> {
    try {
      console.log('🔄 [HYBRID] Tentando criar convite colaborador via API backend...');
      
      // Tentar via API backend primeiro
      const apiResponse = await apiService.criarConviteColaborador({
        empresa_id: dados.empresa_id!,
        email: dados.email,
        nome: dados.nome,
        dias_expiracao: dados.dias_expiracao
      });

      if (apiResponse.success && apiResponse.data) {
        console.log('✅ [HYBRID] Convite colaborador criado via API backend');
        return {
          success: true,
          message: apiResponse.message || 'Convite criado com sucesso via API',
          token: apiResponse.data.token,
          convite: {
            id: apiResponse.data.id,
            token: apiResponse.data.token,
            email: apiResponse.data.email_colaborador,
            nome: apiResponse.data.nome_colaborador,
            empresa_id: apiResponse.data.empresa_id,
            status: apiResponse.data.status,
            validade: apiResponse.data.validade,
            created_at: apiResponse.data.created_at
          },
          source: 'api'
        };
      }

      console.log('⚠️ [HYBRID] API backend falhou, tentando Supabase direto...');
      console.log('🔍 [HYBRID] Erro da API:', apiResponse.error);

      // Fallback para Supabase direto
      const supabaseResponse = await originalService.criarConviteColaborador(dados);
      
      return {
        ...supabaseResponse,
        source: 'supabase'
      };

    } catch (error) {
      console.error('❌ [HYBRID] Erro em ambas as tentativas:', error);
      
      // Último recurso: tentar Supabase direto
      try {
        const supabaseResponse = await originalService.criarConviteColaborador(dados);
        return {
          ...supabaseResponse,
          source: 'supabase'
        };
      } catch (fallbackError) {
        console.error('❌ [HYBRID] Fallback também falhou:', fallbackError);
        return {
          success: false,
          message: 'Erro em todos os métodos de criação de convite',
          source: 'api'
        };
      }
    }
  }

  /**
   * Busca convite por token - usa Supabase direto (leitura é permitida)
   */
  async buscarConvitePorToken(token: string, tipo: 'empresa' | 'colaborador'): Promise<HybridInvitationResponse> {
    try {
      // Para leitura, usar Supabase direto é mais eficiente
      const response = await originalService.buscarConvitePorToken(token, tipo);
      return {
        ...response,
        source: 'supabase'
      };
    } catch (error) {
      console.error('❌ [HYBRID] Erro ao buscar convite:', error);
      return {
        success: false,
        message: 'Erro ao buscar convite',
        source: 'supabase'
      };
    }
  }

  /**
   * Lista convites - usa API backend para dados mais seguros
   */
  async listarConvites(
    tipo?: 'empresa' | 'colaborador',
    empresaId?: string,
    limite?: number,
    offset?: number
  ): Promise<HybridInvitationResponse> {
    try {
      console.log('🔄 [HYBRID] Tentando listar convites via API backend...', { tipo, empresaId });
      
      // Tentar via API backend primeiro
      const apiResponse = await apiService.listarConvites(tipo, limite, offset);

      if (apiResponse.success && apiResponse.data) {
        console.log('✅ [HYBRID] Convites listados via API backend');
        return {
          success: true,
          message: 'Convites listados com sucesso',
          data: apiResponse.data,
          source: 'api'
        };
      }

      console.log('⚠️ [HYBRID] API backend falhou, tentando Supabase direto...');
      
      // Fallback para Supabase direto
      if (tipo === 'colaborador' && empresaId) {
        const supabaseResponse = await originalService.listarConvitesColaborador(empresaId);
        return {
          ...supabaseResponse,
          source: 'supabase'
        };
      } else if (tipo === 'empresa') {
        const supabaseResponse = await originalService.listarConvitesEmpresa();
        return {
          ...supabaseResponse,
          source: 'supabase'
        };
      }

      return {
        success: false,
        message: 'Parâmetros insuficientes para listar convites',
        source: 'supabase'
      };

    } catch (error) {
      console.error('❌ [HYBRID] Erro ao listar convites:', error);
      return {
        success: false,
        message: 'Erro ao listar convites',
        source: 'api'
      };
    }
  }

  /**
   * Usar convite - usa Supabase direto (operação de escrita permitida para usuários autenticados)
   */
  async usarConvite(token: string, tipo: 'empresa' | 'colaborador'): Promise<HybridInvitationResponse> {
    try {
      const response = await originalService.usarConvite(token, tipo);
      return {
        ...response,
        source: 'supabase'
      };
    } catch (error) {
      console.error('❌ [HYBRID] Erro ao usar convite:', error);
      return {
        success: false,
        message: 'Erro ao usar convite',
        source: 'supabase'
      };
    }
  }

  /**
   * Validar convite - usa Supabase direto (leitura é permitida)
   */
  async validarConvite(token: string, tipo: 'empresa' | 'colaborador'): Promise<HybridInvitationResponse> {
    try {
      const response = await originalService.validarConvite(token, tipo);
      return {
        ...response,
        source: 'supabase'
      };
    } catch (error) {
      console.error('❌ [HYBRID] Erro ao validar convite:', error);
      return {
        success: false,
        message: 'Erro ao validar convite',
        source: 'supabase'
      };
    }
  }

  /**
   * Gerar URL do convite - método utilitário
   */
  gerarUrlConvite(token: string, tipo: 'empresa' | 'colaborador'): string {
    return originalService.gerarUrlConvite(token, tipo);
  }

  /**
   * Cancelar convite - usa Supabase direto (operação de atualização permitida)
   */
  async cancelarConvite(token: string, tipo: 'empresa' | 'colaborador'): Promise<HybridInvitationResponse> {
    try {
      const response = await originalService.cancelarConvite(token, tipo);
      return {
        ...response,
        source: 'supabase'
      };
    } catch (error) {
      console.error('❌ [HYBRID] Erro ao cancelar convite:', error);
      return {
        success: false,
        message: 'Erro ao cancelar convite',
        source: 'supabase'
      };
    }
  }

  /**
   * Health check da API backend
   */
  async healthCheck(): Promise<HybridInvitationResponse> {
    try {
      const response = await apiService.healthCheck();
      return {
        success: response.success,
        message: response.success ? 'API backend funcionando' : 'API backend com problemas',
        data: response.data,
        source: 'api'
      };
    } catch (error) {
      console.error('❌ [HYBRID] API backend não disponível:', error);
      return {
        success: false,
        message: 'API backend não disponível',
        source: 'api'
      };
    }
  }
}

const hybridInvitationService = new HybridInvitationService();

export { hybridInvitationService };