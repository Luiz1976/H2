import { apiService } from '../services/apiService';

export const resultadosService = {
  /**
   * Salvar resultado de um teste usando a API local
   */
  async salvarResultado(resultado: any): Promise<any> {
    try {
      console.log('🔍 [RESULTADOS-SERVICE] Iniciando salvamento via API local');
      console.log('📊 [RESULTADOS-SERVICE] Dados recebidos:', resultado);
      
      // Preparar dados para API (converter snake_case para camelCase)
      const dadosApi = {
        testeId: resultado.teste_id || null,
        usuarioId: resultado.usuario_id || null,
        pontuacaoTotal: resultado.pontuacao_total,
        tempoGasto: resultado.tempo_gasto,
        sessionId: resultado.session_id,
        metadados: resultado.metadados,
        status: resultado.status || 'concluido',
        userEmail: resultado.user_email,
        empresaId: resultado.empresa_id || null,
      };
      
      console.log('🔍 [RESULTADOS-SERVICE] Enviando para API local:', dadosApi);
      
      // Salvar via API local
      const resultadoSalvo = await apiService.salvarResultadoTeste(dadosApi);
      
      console.log('✅ [RESULTADOS-SERVICE] Resultado salvo com sucesso via API:', resultadoSalvo);
      
      return resultadoSalvo;
      
    } catch (error) {
      console.error('❌ [RESULTADOS-SERVICE] Erro ao salvar:', error);
      console.error('❌ [RESULTADOS-SERVICE] Stack trace:', error instanceof Error ? error.stack : 'Sem stack trace');
      throw error;
    }
  },
};
