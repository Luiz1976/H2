import { supabase } from '../lib/supabase';

export interface EstatisticasEmpresa {
  total_colaboradores: number;
  colaboradores_ativos: number;
  total_testes_realizados: number;
  convites_pendentes: number;
  testes_este_mes: number;
  media_pontuacao: number;
}

class EmpresaStatisticsService {
  /**
   * Busca estatísticas reais da empresa
   */
  async buscarEstatisticasEmpresa(empresaId: string): Promise<EstatisticasEmpresa> {
    try {
      // 1. Buscar colaboradores da empresa
      const { data: colaboradores, error: errorColaboradores } = await supabase
        .from('colaboradores')
        .select('id, ativo, created_at')
        .eq('empresa_id', empresaId);

      if (errorColaboradores) {
        console.error('Erro ao buscar colaboradores:', errorColaboradores);
      }

      const totalColaboradores = colaboradores?.length || 0;
      const colaboradoresAtivos = colaboradores?.filter(c => c.ativo).length || 0;

      // 2. Buscar convites pendentes
      const { data: convites, error: errorConvites } = await supabase
        .from('convites_colaborador')
        .select('id, status, validade')
        .eq('empresa_id', empresaId);

      if (errorConvites) {
        console.error('Erro ao buscar convites:', errorConvites);
      }

      const agora = new Date();
      const convitesPendentes = convites?.filter(c => 
        c.status === 'pendente' && new Date(c.validade) > agora
      ).length || 0;

      // 3. Buscar resultados de testes dos colaboradores da empresa
      let totalTestesRealizados = 0;
      let testesEsteMes = 0;
      let mediaPontuacao = 0;

      if (colaboradores && colaboradores.length > 0) {
        const colaboradorIds = colaboradores.map(c => c.id);

        // Buscar resultados diretamente da tabela resultados
        const { data: resultados, error: errorResultados } = await supabase
          .from('resultados')
          .select('id, pontuacao_total, data_realizacao, status')
          .in('usuario_id', colaboradorIds);

        if (errorResultados) {
          console.error('Erro ao buscar resultados:', errorResultados);
        }

        if (resultados) {
          // Filtrar apenas resultados concluídos
          const resultadosConcluidos = resultados.filter(resultado => 
            resultado.status === 'concluido'
          );

          totalTestesRealizados = resultadosConcluidos.length;

          // Calcular testes deste mês
          const inicioMes = new Date();
          inicioMes.setDate(1);
          inicioMes.setHours(0, 0, 0, 0);

          testesEsteMes = resultadosConcluidos.filter(resultado => 
            new Date(resultado.data_realizacao) >= inicioMes
          ).length;

          // Calcular média de pontuação
          const pontuacoes = resultadosConcluidos
            .map(r => r.pontuacao_total)
            .filter(p => p !== null && p !== undefined);

          if (pontuacoes.length > 0) {
            mediaPontuacao = pontuacoes.reduce((acc, p) => acc + p, 0) / pontuacoes.length;
          }
        }
      }

      return {
        total_colaboradores: totalColaboradores,
        colaboradores_ativos: colaboradoresAtivos,
        total_testes_realizados: totalTestesRealizados,
        convites_pendentes: convitesPendentes,
        testes_este_mes: testesEsteMes,
        media_pontuacao: Math.round(mediaPontuacao * 10) / 10
      };

    } catch (error) {
      console.error('Erro ao buscar estatísticas da empresa:', error);
      
      // Retornar estatísticas zeradas em caso de erro
      return {
        total_colaboradores: 0,
        colaboradores_ativos: 0,
        total_testes_realizados: 0,
        convites_pendentes: 0,
        testes_este_mes: 0,
        media_pontuacao: 0
      };
    }
  }

  /**
   * Busca resultados de testes da empresa para a página de resultados
   */
  async buscarResultadosEmpresa(empresaId: string) {
    try {
      // Buscar colaboradores da empresa
      const { data: colaboradores, error: errorColaboradores } = await supabase
        .from('colaboradores')
        .select('id, nome, email')
        .eq('empresa_id', empresaId);

      if (errorColaboradores || !colaboradores) {
        console.error('Erro ao buscar colaboradores:', errorColaboradores);
        return [];
      }

      const colaboradorIds = colaboradores.map(c => c.id);

      // Buscar resultados diretamente da tabela resultados
      const { data: resultadosData, error: errorResultados } = await supabase
        .from('resultados')
        .select(`
          id,
          usuario_id,
          teste_id,
          pontuacao_total,
          tempo_gasto,
          data_realizacao,
          status,
          testes (
            id,
            nome,
            categoria
          )
        `)
        .in('usuario_id', colaboradorIds);

      if (errorResultados) {
        console.error('Erro ao buscar resultados:', errorResultados);
        return [];
      }

      // Processar resultados
      const resultados = [];
      
      for (const resultado of resultadosData || []) {
        const colaborador = colaboradores.find(c => c.id === resultado.usuario_id);
        
        resultados.push({
          id: resultado.id,
          colaborador_nome: colaborador?.nome || 'Colaborador Desconhecido',
          colaborador_email: colaborador?.email || '',
          teste_nome: resultado.testes?.nome || 'Teste Desconhecido',
          pontuacao: resultado.pontuacao_total || 0,
          pontuacao_maxima: 100, // Assumindo escala de 0-100
          percentual: resultado.pontuacao_total || 0,
          tempo_conclusao: Math.round((resultado.tempo_gasto || 0) / 60), // converter para minutos
          data_realizacao: resultado.data_realizacao,
          status: resultado.status === 'concluido' ? 'concluido' : 
                 resultado.status === 'em_andamento' ? 'em_andamento' : 'nao_iniciado',
          categoria: resultado.testes?.categoria || 'Geral',
          nivel_dificuldade: 'medio' as const
        });
      }

      return resultados.sort((a, b) => 
        new Date(b.data_realizacao).getTime() - new Date(a.data_realizacao).getTime()
      );

    } catch (error) {
      console.error('Erro ao buscar resultados da empresa:', error);
      return [];
    }
  }
}

export const empresaStatisticsService = new EmpresaStatisticsService();