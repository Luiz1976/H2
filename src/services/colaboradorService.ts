import { supabase } from '../lib/supabase';
import { authService } from './authService';

export interface ColaboradorCompleto {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  empresa_id: string;
  permissoes: any;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  avatar?: string;
}

class ColaboradorService {
  async getDadosColaboradorLogado(): Promise<ColaboradorCompleto | null> {
    try {
      console.log('🔍 [ColaboradorService] Iniciando busca por dados do colaborador logado...');
      
      // Obter usuário autenticado do authService
      const user = authService.getCurrentUser();
      console.log('👤 [ColaboradorService] Usuário obtido:', user);
      
      if (!user) {
        console.log('⚠️ [ColaboradorService] Nenhum usuário autenticado');
        return null;
      }

      // Se o usuário já tem os dados completos e é um colaborador, retornar diretamente
      if (user.role === 'colaborador' && user.empresa_id) {
        console.log('📧 [ColaboradorService] Buscando colaborador com email:', user.email);

        // Buscar dados do colaborador na tabela
        const { data: colaborador, error: colaboradorError } = await supabase
          .from('colaboradores')
          .select('*')
          .eq('email', user.email)
          .single();

        console.log('📋 [ColaboradorService] Resultado da query:', colaborador);

        if (colaboradorError) {
          console.error('❌ [ColaboradorService] Erro ao buscar colaborador:', colaboradorError);
          return null;
        }

        console.log('✅ [ColaboradorService] Colaborador encontrado com sucesso');
        return colaborador;
      } else {
        console.log('⚠️ [ColaboradorService] Usuário não é um colaborador ou não tem empresa_id');
        return null;
      }
    } catch (error) {
      console.error('❌ [ColaboradorService] Erro geral:', error);
      return null;
    }
  }

  /**
   * Atualiza dados do colaborador
   */
  async atualizarColaborador(id: string, dados: Partial<ColaboradorCompleto>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('colaboradores')
        .update(dados)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar colaborador:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro no serviço de atualização:', error);
      return false;
    }
  }
}

export const colaboradorService = new ColaboradorService();