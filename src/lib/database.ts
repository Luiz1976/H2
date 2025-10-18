import { supabase, retryWithBackoff } from './supabase';
import type { Teste, Pergunta, Resultado, Resposta, AnaliseResultado } from './types';
import { climaOrganizacionalService } from './services/clima-organizacional-service';
import { karasekSiegristService } from './services/karasek-siegrist-service';
import { sessionService } from './services/session-service';

// ==================== TESTES ====================

export const testesService = {
  // Buscar todos os testes ativos
  async buscarTestes(): Promise<Teste[]> {
    const { data, error } = await supabase
      .from('testes')
      .select('*')
      .eq('ativo', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar testes:', error);
      throw new Error('Falha ao carregar testes');
    }

    return data || [];
  },

  // Buscar teste por ID
  async buscarTestePorId(id: string): Promise<Teste | null> {
    const { data, error } = await supabase
      .from('testes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar teste:', error);
      return null;
    }

    return data;
  },

  // Criar novo teste
  async criarTeste(teste: Omit<Teste, 'id' | 'created_at' | 'updated_at'>): Promise<Teste> {
    const { data, error } = await supabase
      .from('testes')
      .insert(teste)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar teste:', error);
      throw new Error('Falha ao criar teste');
    }

    return data;
  }
};

// ==================== PERGUNTAS ====================

export const perguntasService = {
  // Buscar perguntas de um teste
  async buscarPerguntasPorTeste(testeId: string): Promise<Pergunta[]> {
    const { data, error } = await supabase
      .from('perguntas')
      .select('*')
      .eq('teste_id', testeId)
      .order('ordem', { ascending: true });

    if (error) {
      console.error('Erro ao buscar perguntas:', error);
      throw new Error('Falha ao carregar perguntas');
    }

    return data || [];
  },

  // Criar nova pergunta
  async criarPergunta(pergunta: Omit<Pergunta, 'id' | 'created_at' | 'updated_at'>): Promise<Pergunta> {
    const { data, error } = await supabase
      .from('perguntas')
      .insert(pergunta)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar pergunta:', error);
      throw new Error('Falha ao criar pergunta');
    }

    return data;
  }
};

// ==================== RESULTADOS ====================

export const resultadosService = {
  // Salvar resultado de um teste com session_id
  async salvarResultado(resultado: Omit<Resultado, 'id' | 'data_realizacao'>): Promise<Resultado> {
    try {
      console.log('🔍 [DATABASE] Iniciando salvamento do resultado');
      console.log('🔍 [DATABASE] Dados recebidos:', resultado);
      console.log('🔍 [DATABASE] Tipo dos dados:', typeof resultado);
      console.log('🔍 [DATABASE] Campos presentes:', Object.keys(resultado));
      
      // Normalizar e validar session_id
      const isValidUUIDv4 = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      let normalizedResultado = { ...resultado } as any;
      if (!normalizedResultado.session_id || !isValidUUIDv4(normalizedResultado.session_id)) {
        const regenerated = sessionService.getSessionId();
        console.warn('⚠️ [DATABASE] session_id inválido ou ausente. Gerando/forçando UUID v4:', {
          recebido: normalizedResultado.session_id,
          usando: regenerated
        });
        normalizedResultado.session_id = regenerated;
      }
      
      // Validar dados obrigatórios
      console.log('🔍 [DATABASE] Validando campos obrigatórios...');
      if (!normalizedResultado.session_id) {
        console.error('❌ [DATABASE] session_id é obrigatório');
        throw new Error('session_id é obrigatório');
      }
      
      if (typeof normalizedResultado.pontuacao_total !== 'number') {
        console.error('❌ [DATABASE] pontuacao_total deve ser um número');
        throw new Error('pontuacao_total deve ser um número');
      }
      
      console.log('🔍 [DATABASE] Validação concluída com sucesso');
      console.log('🔍 [DATABASE] Tentando inserir no Supabase...');
      
      const resultadoDireto = await supabase
        .from('resultados')
        .insert(normalizedResultado);

      console.log('🔍 [DATABASE] Resultado - data:', resultadoDireto.data);
      console.log('🔍 [DATABASE] Resultado - error:', resultadoDireto.error);

      if (resultadoDireto.error) {
        console.error('❌ [DATABASE] Erro ao salvar resultado:', resultadoDireto.error);
        console.error('❌ [DATABASE] Detalhes do erro:', JSON.stringify(resultadoDireto.error, null, 2));
        throw new Error(`Falha ao salvar resultado: ${resultadoDireto.error.message}`);
      }

      console.log('✅ [DATABASE] Resultado salvo com sucesso');
      
      // Como não usamos .select(), o Supabase retorna data: null mesmo quando a inserção é bem-sucedida
      // Vamos criar um objeto de retorno com os dados que temos disponíveis
      const resultadoItem = {
        ...normalizedResultado,
        id: sessionService.getSessionId(), // Usar session_id como identificador temporário
        data_realizacao: new Date().toISOString()
      };
      
      console.log('✅ [DATABASE] Resultado processado com sucesso:', {
        session_id: resultadoItem.session_id,
        pontuacao_total: resultadoItem.pontuacao_total,
        teste_id: resultadoItem.teste_id
      });
      
      return resultadoItem;
      
    } catch (error) {
      console.error('❌ [DATABASE] Erro geral no salvamento:', error);
      console.error('❌ [DATABASE] Stack trace:', error instanceof Error ? error.stack : 'Sem stack trace');
      throw error;
    }
  },

  // Salvar uma resposta individual durante o teste
  async salvarResposta(resposta: {
    teste_id: string;
    usuario_id: string | null;
    session_id: string;
    pergunta_id: number;
    resposta: number;
    timestamp: string;
  }): Promise<void> {
    try {
      console.log('🔍 [DATABASE] Iniciando salvamento de resposta individual');
      console.log('📊 [DATABASE] Dados da resposta:', JSON.stringify(resposta, null, 2));
      
      // Garantir UUID v4 válido no session_id
      const isValidUUIDv4 = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      let sessionIdToUse = resposta.session_id;
      if (!isValidUUIDv4(sessionIdToUse)) {
        const regenerated = sessionService.getSessionId();
        console.warn('⚠️ [DATABASE] session_id inválido ao salvar resposta. Substituindo por UUID v4:', {
          recebido: resposta.session_id,
          usando: regenerated
        });
        sessionIdToUse = regenerated;
      }
      
      // Verificar se o Supabase está configurado
      if (!supabase) {
        console.error('❌ [DATABASE] Supabase não está configurado');
        throw new Error('Supabase não está configurado');
      }
      
      console.log('🔗 [DATABASE] Supabase configurado, preparando inserção...');
      
      const dadosParaInserir = {
        teste_id: resposta.teste_id,
        usuario_id: resposta.usuario_id,
        session_id: sessionIdToUse,
        pergunta_id: resposta.pergunta_id.toString(),
        resposta: resposta.resposta.toString(),
        pontuacao: resposta.resposta,
        tempo_resposta: null,
        created_at: resposta.timestamp
      };
      
      console.log('📝 [DATABASE] Dados formatados para inserção:', JSON.stringify(dadosParaInserir, null, 2));
      
      // Adicionar log antes da operação Supabase
      console.log('🚀 [DATABASE] Executando inserção no Supabase...');
      
      const { data, error } = await supabase
        .from('respostas_individuais')
        .insert(dadosParaInserir)
        .select();

      console.log('📡 [DATABASE] Resposta do Supabase recebida');
      console.log('📄 [DATABASE] Data:', JSON.stringify(data, null, 2));
      console.log('⚠️ [DATABASE] Error:', JSON.stringify(error, null, 2));

      if (error) {
        console.error('❌ [DATABASE] Erro detalhado do Supabase:', JSON.stringify(error, null, 2));
        console.error('❌ [DATABASE] Código do erro:', error.code);
        console.error('❌ [DATABASE] Mensagem do erro:', error.message);
        console.error('❌ [DATABASE] Detalhes do erro:', error.details);
        console.error('❌ [DATABASE] Hint do erro:', error.hint);
        throw new Error(`Falha ao salvar resposta individual: ${error.message}`);
      }

      console.log('✅ [DATABASE] Resposta individual salva com sucesso');
      console.log('📄 [DATABASE] Dados retornados:', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('❌ [DATABASE] Erro geral no salvamento da resposta:', error);
      console.error('🔍 [DATABASE] Tipo do erro:', typeof error);
      console.error('🔍 [DATABASE] Nome do erro:', error instanceof Error ? error.name : 'Unknown');
      console.error('🔍 [DATABASE] Mensagem do erro:', error instanceof Error ? error.message : String(error));
      console.error('🔍 [DATABASE] Stack trace:', error instanceof Error ? error.stack : 'Sem stack trace');
      
      // Log adicional para debugging
      if (error instanceof Error && error.message.includes('fetch')) {
        console.error('🌐 [DATABASE] Possível problema de conectividade de rede');
      }
      
      throw error;
    }
  },

  // Função para verificar se um resultado específico existe e qual seu session_id
  async verificarResultadoPorId(id: string): Promise<{ existe: boolean; sessionId?: string; resultado?: any }> {
    try {
      console.log('🔍 [VERIFICAR-RESULTADO] Verificando resultado com ID:', id);
      
      const { data, error } = await supabase
        .from('resultados')
        .select(`
          *,
          testes!inner(
            id,
            nome,
            categoria,
            tempo_estimado
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ [VERIFICAR-RESULTADO] Erro ao buscar resultado:', error);
        return { existe: false };
      }

      if (!data) {
        console.log('❌ [VERIFICAR-RESULTADO] Resultado não encontrado');
        return { existe: false };
      }

      console.log('✅ [VERIFICAR-RESULTADO] Resultado encontrado:', {
        id: data.id,
        session_id: data.session_id,
        tipo_teste: data.testes?.nome,
        created_at: data.data_realizacao,
        pontuacao_total: data.pontuacao_total
      });

      return {
        existe: true,
        sessionId: data.session_id,
        resultado: data
      };
    } catch (error) {
      console.error('❌ [VERIFICAR-RESULTADO] Erro inesperado:', error);
      return { existe: false };
    }
  },

  // Buscar resultado específico por ID com respostas
  async buscarResultadoPorId(id: string): Promise<Resultado | null> {
    try {
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] ===== INICIANDO BUSCA =====');
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] ID solicitado:', id);
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] Tipo do ID:', typeof id);
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] Comprimento do ID:', id.length);
      
      // ===== CONTROLE DE ACESSO E SEGURANÇA =====
      console.log('🔐 [BUSCAR-RESULTADO-POR-ID] Iniciando verificação de controle de acesso');
      
      // Importar authService dinamicamente para evitar dependência circular
      const { authService } = await import('../services/authService');
      
      // Verificação de acesso: obter usuário atual e verificar se ele pode acessar este resultado
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        console.log('❌ [BUSCAR-RESULTADO-POR-ID] Usuário não autenticado - acesso negado');
        console.log('🔒 [BUSCAR-RESULTADO-POR-ID] AUDITORIA: Tentativa de acesso não autenticado ao resultado ID:', id);
        return null;
      }
      
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] Usuário autenticado:', { 
        email: currentUser.email, 
        role: currentUser.role, 
        empresa_id: currentUser.empresa_id 
      });
      
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] Iniciando query simplificada...');
      
      // Timeout mais agressivo de 5 segundos
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout após 5 segundos')), 5000);
      });

      // Query simplificada sem joins complexos
      // Primeiro tentar na tabela resultados genérica
      let queryPromise = supabase
        .from('resultados')
        .select('*')
        .eq('id', id)
        .single();

      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] Tentando busca na tabela resultados...');
      
      let { data, error } = await Promise.race([queryPromise, timeoutPromise]);
      let tabelaOrigem = 'resultados';
      
      // Se não encontrou na tabela genérica, tentar na tabela específica QVT
      if (error && error.code === 'PGRST116') {
        console.log('🔄 [BUSCAR-RESULTADO-POR-ID] Não encontrado em resultados, tentando resultados_qvt...');
        
        queryPromise = supabase
          .from('resultados_qvt')
          .select('*')
          .eq('id', id)
          .single();
          
        const resultQVT = await Promise.race([queryPromise, timeoutPromise]);
        data = resultQVT.data;
        error = resultQVT.error;
        tabelaOrigem = 'resultados_qvt';
        
        if (data) {
          console.log('✅ [BUSCAR-RESULTADO-POR-ID] Encontrado na tabela resultados_qvt!');
        }
      }

      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] Query executada, verificando resultado...');
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] Data recebida:', data ? 'DADOS ENCONTRADOS' : 'NENHUM DADO');
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] Error recebido:', error ? 'ERRO ENCONTRADO' : 'NENHUM ERRO');

      if (error) {
        console.error('❌ [BUSCAR-RESULTADO-POR-ID] Erro na query:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return null;
      }

      if (!data) {
        console.log('❌ [BUSCAR-RESULTADO-POR-ID] Nenhum resultado encontrado para ID:', id);
        return null;
      }
      
      // ===== CONTROLE DE ACESSO POR PAPEL =====
      console.log('🔐 [BUSCAR-RESULTADO-POR-ID] Verificando permissões de acesso');
      
      // Verificar se o resultado pertence ao colaborador atual (se for colaborador)
      if (currentUser.role === 'colaborador') {
        console.log('👤 [BUSCAR-RESULTADO-POR-ID] Verificando acesso para colaborador');
        
        const { data: colaboradorData, error: colaboradorError } = await supabase
          .from('colaboradores')
          .select('id')
          .eq('email', currentUser.email)
          .single();
        
        if (colaboradorError) {
          console.error('❌ [BUSCAR-RESULTADO-POR-ID] Erro ao buscar dados do colaborador:', colaboradorError);
          console.log('🔒 [BUSCAR-RESULTADO-POR-ID] AUDITORIA: Erro na verificação de colaborador para resultado ID:', id);
          return null;
        }
        
        if (colaboradorData && data.usuario_id === colaboradorData.id) {
          console.log('✅ [BUSCAR-RESULTADO-POR-ID] Acesso permitido para colaborador proprietário');
          console.log('🔒 [BUSCAR-RESULTADO-POR-ID] AUDITORIA: Acesso autorizado - colaborador proprietário:', currentUser.email);
        } else {
          console.log('❌ [BUSCAR-RESULTADO-POR-ID] Acesso negado: resultado não pertence ao colaborador');
          console.log('🔒 [BUSCAR-RESULTADO-POR-ID] AUDITORIA: Tentativa de acesso negado - colaborador não proprietário:', {
            usuario_email: currentUser.email,
            colaborador_id: colaboradorData?.id,
            resultado_usuario_id: data.usuario_id,
            resultado_id: id
          });
          return null;
        }
      }
      
      // Verificar se é empresa e se o resultado pertence a um colaborador da empresa
      if (currentUser.role === 'empresa' && currentUser.empresa_id) {
        console.log('🏢 [BUSCAR-RESULTADO-POR-ID] Verificando acesso para empresa');
        
        const { data: colaboradorResultado, error: empresaError } = await supabase
          .from('colaboradores')
          .select('empresa_id')
          .eq('id', data.usuario_id)
          .single();
        
        if (empresaError) {
          console.error('❌ [BUSCAR-RESULTADO-POR-ID] Erro ao verificar vinculação empresa-colaborador:', empresaError);
          console.log('🔒 [BUSCAR-RESULTADO-POR-ID] AUDITORIA: Erro na verificação de empresa para resultado ID:', id);
          return null;
        }
        
        if (colaboradorResultado && colaboradorResultado.empresa_id === currentUser.empresa_id) {
          console.log('✅ [BUSCAR-RESULTADO-POR-ID] Acesso permitido para empresa proprietária');
          console.log('🔒 [BUSCAR-RESULTADO-POR-ID] AUDITORIA: Acesso autorizado - empresa proprietária:', {
            empresa_id: currentUser.empresa_id,
            usuario_email: currentUser.email
          });
        } else {
          console.log('❌ [BUSCAR-RESULTADO-POR-ID] Acesso negado: resultado não pertence à empresa');
          console.log('🔒 [BUSCAR-RESULTADO-POR-ID] AUDITORIA: Tentativa de acesso negado - empresa não proprietária:', {
            usuario_email: currentUser.email,
            empresa_id_usuario: currentUser.empresa_id,
            empresa_id_colaborador: colaboradorResultado?.empresa_id,
            resultado_id: id
          });
          return null;
        }
      }
      
      // Admins têm acesso a todos os resultados
      if (currentUser.role === 'admin') {
        console.log('✅ [BUSCAR-RESULTADO-POR-ID] Acesso permitido para admin');
        console.log('🔒 [BUSCAR-RESULTADO-POR-ID] AUDITORIA: Acesso autorizado - usuário admin:', currentUser.email);
      }
      
      // Se chegou até aqui, o acesso foi autorizado
      console.log('🔐 [BUSCAR-RESULTADO-POR-ID] Controle de acesso concluído - acesso autorizado');

      console.log('✅ [BUSCAR-RESULTADO-POR-ID] Resultado encontrado!');
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] ID do resultado:', data.id);
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] teste_id:', data.teste_id);
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] session_id:', data.session_id);
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] pontuacao_total:', data.pontuacao_total);
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] status:', data.status);
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] data_realizacao:', data.data_realizacao);
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] metadados existe?', !!data.metadados);
      
      if (data.metadados) {
        console.log('🔍 [BUSCAR-RESULTADO-POR-ID] metadados.tipo_teste:', data.metadados.tipo_teste);
        console.log('🔍 [BUSCAR-RESULTADO-POR-ID] metadados.analise_completa existe?', !!data.metadados.analise_completa);
        console.log('🔍 [BUSCAR-RESULTADO-POR-ID] metadados keys:', Object.keys(data.metadados));
        
        if (data.metadados.analise_completa) {
          console.log('🔍 [BUSCAR-RESULTADO-POR-ID] analise_completa.mediaGeral existe?', !!data.metadados.analise_completa.mediaGeral);
          console.log('🔍 [BUSCAR-RESULTADO-POR-ID] analise_completa keys:', Object.keys(data.metadados.analise_completa));
        }
      }

      // Retornar dados com tipo_teste dos metadados ou detectar QVT pelos campos específicos
      let tipoTeste = data.metadados?.tipo_teste || null;
      
      // Se não tem tipo_teste mas tem campos específicos do QVT, definir como QVT
      if (!tipoTeste && (data.indice_geral !== undefined || data.nivel_geral !== undefined || data.satisfacao_funcao !== undefined)) {
        tipoTeste = 'qualidade-vida-trabalho';
        console.log('🔍 [BUSCAR-RESULTADO-POR-ID] Detectado como QVT pelos campos específicos');
      }
      
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] ===== MAPEAMENTO DE CAMPOS QVT =====');
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] indice_geral:', data.indice_geral);
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] nivel_geral:', data.nivel_geral);
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] percentual_geral:', data.percentual_geral);
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] satisfacao_funcao:', data.satisfacao_funcao);
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] pontos_fortes:', data.pontos_fortes);
      
      const resultado = {
        id: data.id,
        session_id: data.session_id,
        tipo_teste: tipoTeste,
        created_at: data.created_at || data.data_realizacao,
        pontuacao_total: data.pontuacao_total,
        teste_id: data.teste_id,
        metadados: data.metadados || {
          tipo_teste: tipoTeste,
          teste_nome: 'Qualidade de Vida no Trabalho'
        },
        respostas: [], // Sem respostas por enquanto para simplificar
        
        // Campos específicos do QVT se existirem
        ...(data.indice_geral !== undefined && {
          indice_geral: data.indice_geral,
          nivel_geral: data.nivel_geral,
          percentual_geral: data.percentual_geral,
          satisfacao_funcao: data.satisfacao_funcao,
          relacao_lideranca: data.relacao_lideranca,
          estrutura_condicoes: data.estrutura_condicoes,
          recompensas_remuneracao: data.recompensas_remuneracao,
          equilibrio_vida_trabalho: data.equilibrio_vida_trabalho,
          dimensoes_criticas: data.dimensoes_criticas,
          pontos_fortes: data.pontos_fortes,
          risco_turnover: data.risco_turnover
        })
      };
      
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] Resultado final preparado:', {
        id: resultado.id,
        pontuacao_total: resultado.pontuacao_total,
        tipo_teste: resultado.tipo_teste,
        tem_metadados: !!resultado.metadados,
        tem_analise_completa: !!resultado.metadados?.analise_completa
      });
      console.log('🔍 [BUSCAR-RESULTADO-POR-ID] ===== BUSCA CONCLUÍDA =====');
      
      return resultado;
    } catch (error) {
      console.error('❌ [BUSCAR-RESULTADO-POR-ID] Erro inesperado:', error);
      console.error('❌ [BUSCAR-RESULTADO-POR-ID] Stack trace:', error instanceof Error ? error.stack : 'Sem stack trace');
      return null;
    }
  },

  // Buscar TODOS os resultados (de todas as sessões) - NOVA FUNÇÃO COM RPC
  async buscarTodosResultados(filtros?: {
    tipoTeste?: string;
    dataInicio?: string;
    dataFim?: string;
    pontuacaoMin?: number;
    pontuacaoMax?: number;
    busca?: string;
    limite?: number;
    offset?: number;
    userEmail?: string; // Filtrar por email do usuário autenticado
    empresa_id?: string; // Filtrar por empresa_id para que empresas vejam resultados de seus colaboradores
  }): Promise<{ resultados: Resultado[]; total: number }> {
    try {
      console.log('🔍 [BUSCAR-TODOS-RESULTADOS-RPC] Buscando todos os resultados via RPC');
      console.log('🔍 [BUSCAR-TODOS-RESULTADOS-RPC] Filtros aplicados:', filtros);

      // Usar a função RPC para evitar problemas de RLS
      const { data, error } = await supabase.rpc('buscar_todos_resultados_simples', {
        user_email_param: filtros?.userEmail || null,
        limite_param: filtros?.limite || 50,
        offset_param: filtros?.offset || 0
      });

      console.log('🔍 [BUSCAR-TODOS-RESULTADOS-RPC] RPC executada - dados brutos:', { data, error });

      if (error) {
        console.error('❌ [BUSCAR-TODOS-RESULTADOS-RPC] Erro na RPC:', {
          message: (error as any)?.message,
          code: (error as any)?.code,
          details: (error as any)?.details,
          hint: (error as any)?.hint
        });
        throw error;
      }

      if (!data) {
        console.log('⚠️ [BUSCAR-TODOS-RESULTADOS-RPC] Nenhum resultado encontrado');
        return { resultados: [], total: 0 };
      }

      // Aplicar filtros adicionais no lado do cliente (se necessário)
      let resultadosFiltrados = data;

      if (filtros?.tipoTeste) {
        const tipo = filtros.tipoTeste.toLowerCase();
        resultadosFiltrados = resultadosFiltrados.filter((resultado: any) => {
          const metadados = resultado.metadados || {};
          const testeNome = (metadados.teste_nome || '').toLowerCase();
          const tipoTeste = (metadados.tipo_teste || '').toLowerCase();
          return testeNome.includes(tipo) || tipoTeste.includes(tipo);
        });
      }

      if (filtros?.dataInicio) {
        const dataInicio = new Date(filtros.dataInicio);
        resultadosFiltrados = resultadosFiltrados.filter((resultado: any) => 
          new Date(resultado.data_realizacao) >= dataInicio
        );
      }

      if (filtros?.dataFim) {
        const dataFim = new Date(filtros.dataFim);
        resultadosFiltrados = resultadosFiltrados.filter((resultado: any) => 
          new Date(resultado.data_realizacao) <= dataFim
        );
      }

      if (filtros?.pontuacaoMin !== undefined) {
        resultadosFiltrados = resultadosFiltrados.filter((resultado: any) => 
          resultado.pontuacao_total >= filtros.pontuacaoMin!
        );
      }

      if (filtros?.pontuacaoMax !== undefined) {
        resultadosFiltrados = resultadosFiltrados.filter((resultado: any) => 
          resultado.pontuacao_total <= filtros.pontuacaoMax!
        );
      }

      if (filtros?.busca) {
        const busca = filtros.busca.toLowerCase();
        resultadosFiltrados = resultadosFiltrados.filter((resultado: any) => {
          const metadados = resultado.metadados || {};
          const observacoes = (metadados.observacoes || '').toLowerCase();
          return observacoes.includes(busca);
        });
      }

      console.log('✅ [BUSCAR-TODOS-RESULTADOS-RPC] Resultados encontrados:', resultadosFiltrados?.length || 0);
      
      // Processar resultados para garantir que tenham nome do teste
      console.log('🔍 [DEBUG] Dados brutos recebidos:', resultadosFiltrados?.length || 0);
      console.log('🔍 [DEBUG] Primeiros 3 resultados brutos:', JSON.stringify(resultadosFiltrados?.slice(0, 3), null, 2));
      
      const resultadosProcessados = (resultadosFiltrados || [])
        .map((resultado, index) => {
          console.log(`🔍 [DEBUG-MAP] Processando resultado ${index + 1}:`, {
            id: resultado.id,
            teste_id: resultado.teste_id,
            metadados_tipo_teste: resultado.metadados?.tipo_teste,
            metadados_teste_nome: resultado.metadados?.teste_nome
          });
          
          // Obter nome do teste dos metadados
          let nomeTeste = resultado.metadados?.teste_nome;
          
          if (!nomeTeste && resultado.metadados?.tipo_teste) {
            // Mapear tipos de teste conhecidos
            const tiposConhecidos: Record<string, string> = {
              'karasek-siegrist': 'HumaniQ - Karasek-Siegrist',
              'clima-organizacional': 'HumaniQ Clima Organizacional',
              'pas': 'Percepção de Assédio (PAS)',
              'rpo': 'Riscos Psicossociais Ocupacionais (RPO)',
              'qvt': 'Qualidade de Vida no Trabalho (QVT)',
              'estresse-ocupacional': 'Estresse Ocupacional',
              '55fc21f9-cc10-4b4a-8765-3f5087eaf1f5': 'Clima e Bem-Estar',
              'mgrp': 'MGRP - Modelo de Gestão de Riscos Psicossociais'
            };
            nomeTeste = tiposConhecidos[resultado.metadados.tipo_teste] || resultado.metadados.tipo_teste;
            console.log(`🔍 [DEBUG-MAP] Nome obtido de tipo_teste: "${nomeTeste}"`);
          }
          
          const nomeTesteFinal = nomeTeste || 'Teste Desconhecido';
          console.log(`🔍 [DEBUG-MAP] Nome final para resultado ${resultado.id}: "${nomeTesteFinal}"`);
          
          return {
            ...resultado,
            testes: resultado.testes || { nome: nomeTesteFinal }
          };
        })
        .filter((resultado, index) => {
          const metadados = resultado.metadados || {};
          
          // Filtrar resultados marcados como deletados
          if (metadados.deleted === true) {
            console.log('🗑️ [BUSCAR-TODOS-RESULTADOS] Resultado deletado filtrado:', {
              id: resultado.id?.substring(0, 8),
              deleted_at: metadados.deleted_at,
              delete_reason: metadados.delete_reason
            });
            return false;
          }
          
          // Filtrar resultados sem teste válido
          const nomeTesteValido = resultado.testes?.nome;
          
          console.log(`🔍 [DEBUG-FILTER] Avaliando resultado ${index + 1} (ID: ${resultado.id}):`, {
            nome: nomeTesteValido,
            teste_id: resultado.teste_id,
            tipo_teste: resultado.metadados?.tipo_teste
          });
          
          // Excluir se:
          // 1. Nome é "Teste Desconhecido"
          // 2. teste_id é null E não tem tipo_teste válido nos metadados
          if (nomeTesteValido === 'Teste Desconhecido') {
            console.log('🚫 [FILTRO] Excluindo resultado "Teste Desconhecido":', resultado.id);
            return false;
          }
          
          if (!resultado.teste_id && !resultado.metadados?.tipo_teste) {
            console.log('🚫 [FILTRO] Excluindo resultado sem teste_id e sem tipo_teste:', resultado.id);
            return false;
          }
          
          console.log('✅ [FILTRO] Mantendo resultado real:', resultado.id, nomeTesteValido);
          return true;
        });

      console.log('🔍 [BUSCAR-TODOS-RESULTADOS] Resultados processados:', resultadosProcessados.length);
      resultadosProcessados.forEach(r => {
        console.log('  -', r.id, ':', r.testes?.nome, '(teste_id:', r.teste_id, ')');
      });

      console.log('✅ [BUSCAR-TODOS-RESULTADOS-RPC] Processamento concluído');
      console.log('✅ [BUSCAR-TODOS-RESULTADOS-RPC] Total final de resultados:', resultadosProcessados.length);

      return {
        resultados: resultadosProcessados,
        total: resultadosFiltrados.length
      };

    } catch (error) {
      console.error('❌ [BUSCAR-TODOS-RESULTADOS-RPC] Erro geral:', error);
      throw error;
    }
  },

  // Buscar resultados por sessão (principal função para persistência) - OTIMIZADA
  async buscarResultadosPorSessao(sessionId: string, filtros?: {
    tipoTeste?: string;
    dataInicio?: string;
    dataFim?: string;
    pontuacaoMin?: number;
    pontuacaoMax?: number;
    busca?: string;
    limite?: number;
    offset?: number;
  }): Promise<{ resultados: Resultado[]; total: number }> {
    try {
      console.log('🔍 [BUSCAR-POR-SESSAO] Buscando resultados para sessão:', sessionId);
      console.log('🔍 [BUSCAR-POR-SESSAO] Filtros aplicados:', filtros);
      
      let query = supabase
        .from('resultados')
        .select(`
          id,
          session_id,
          teste_id,
          pontuacao_total,
          tempo_gasto,
          data_realizacao,
          metadados,
          testes!inner(
            id,
            nome,
            categoria,
            tempo_estimado
          )
        `, { count: 'exact' })
        .eq('session_id', sessionId);

      // Aplicar filtros
      if (filtros?.tipoTeste) {
        query = query.eq('testes.nome', filtros.tipoTeste);
      }

      if (filtros?.dataInicio) {
        query = query.gte('data_realizacao', filtros.dataInicio);
      }

      if (filtros?.dataFim) {
        query = query.lte('data_realizacao', filtros.dataFim);
      }

      if (filtros?.pontuacaoMin !== undefined) {
        query = query.gte('pontuacao_total', filtros.pontuacaoMin);
      }

      if (filtros?.pontuacaoMax !== undefined) {
        query = query.lte('pontuacao_total', filtros.pontuacaoMax);
      }

      // Busca por texto nos metadados ou nome do teste
      if (filtros?.busca) {
        query = query.or(`testes.nome.ilike.%${filtros.busca}%,metadados->>'observacoes'.ilike.%${filtros.busca}%`);
      }

      // Ordenação e paginação otimizada
      query = query.order('data_realizacao', { ascending: false });

      if (filtros?.limite) {
        query = query.limit(filtros.limite);
      }

      if (filtros?.offset) {
        query = query.range(filtros.offset, (filtros.offset + (filtros.limite || 10)) - 1);
      }

      console.log('🔍 [BUSCAR-POR-SESSAO] Executando query...');
      const { data, error, count } = await query;

      console.log('🔍 [BUSCAR-POR-SESSAO] Resposta da query:', { data: data?.length, error, count });

      if (error) {
        console.error('❌ [BUSCAR-POR-SESSAO] Erro na query:', error);
        throw error;
      }

      console.log('✅ [BUSCAR-POR-SESSAO] Resultados encontrados:', data?.length || 0);
      console.log('✅ [BUSCAR-POR-SESSAO] Total de registros:', count);
      console.log('✅ [BUSCAR-POR-SESSAO] Dados retornados:', data);

      return {
        resultados: data || [],
        total: count || 0
      };

    } catch (error) {
      console.error('❌ [BUSCAR-POR-SESSAO] Erro geral:', error);
      throw error;
    }
  },

  // Buscar tipos de teste únicos para filtros
  async buscarTiposTeste(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('testes')
        .select('nome')
        .eq('ativo', true)
        .order('nome');

      if (error) {
        console.error('❌ [TIPOS-TESTE] Erro ao buscar tipos:', error);
        throw new Error(`Falha ao carregar tipos de teste: ${error.message}`);
      }

      return data?.map(t => t.nome) || [];

    } catch (error) {
      console.error('❌ [TIPOS-TESTE] Erro geral:', error);
      throw error;
    }
  },

  // Buscar estatísticas de um teste
  async buscarEstatisticasTeste(testeId: string) {
    const { data, error } = await supabase
      .from('resultados')
      .select('pontuacao_total, tempo_gasto')
      .eq('teste_id', testeId);

    if (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw new Error('Falha ao carregar estatísticas');
    }

    if (!data || data.length === 0) {
      return {
        total_realizacoes: 0,
        media_pontuacao: 0,
        media_tempo: 0,
        distribuicao_pontuacoes: { baixo: 0, medio: 0, alto: 0 }
      };
    }

    const totalRealizacoes = data.length;
    const mediaPontuacao = data.reduce((acc, r) => acc + r.pontuacao_total, 0) / totalRealizacoes;
    const mediaTempo = data.reduce((acc, r) => acc + r.tempo_gasto, 0) / totalRealizacoes;

    // Distribuição de pontuações (assumindo escala 0-100)
    const distribuicao = data.reduce(
      (acc, r) => {
        if (r.pontuacao_total < 40) acc.baixo++;
        else if (r.pontuacao_total < 70) acc.medio++;
        else acc.alto++;
        return acc;
      },
      { baixo: 0, medio: 0, alto: 0 }
    );

    return {
      total_realizacoes: totalRealizacoes,
      media_pontuacao: Math.round(mediaPontuacao * 100) / 100,
      media_tempo: Math.round(mediaTempo * 100) / 100,
      distribuicao_pontuacoes: distribuicao
    };
  }
};

// ==================== RESPOSTAS ====================

export const respostasService = {
  // Salvar respostas de um resultado
  async salvarRespostas(respostas: Omit<Resposta, 'id' | 'created_at'>[]): Promise<Resposta[]> {
    const { data, error } = await supabase
      .from('respostas')
      .insert(respostas)
      .select();

    if (error) {
      console.error('Erro ao salvar respostas:', error);
      throw new Error('Falha ao salvar respostas');
    }

    return data || [];
  },

  // Buscar respostas por resultado
  async buscarRespostasPorResultado(resultadoId: string): Promise<Resposta[]> {
    const { data, error } = await supabase
      .from('respostas')
      .select('*')
      .eq('resultado_id', resultadoId);

    if (error) {
      console.error('Erro ao buscar respostas:', error);
      throw new Error('Falha ao carregar respostas');
    }

    return data || [];
  }
};

// ==================== ANÁLISE ====================

export const analiseService = {
  // Calcular análise de resultado
  calcularAnalise(respostas: Resposta[], perguntas: Pergunta[]): AnaliseResultado {
    // Lógica simplificada de análise - pode ser expandida conforme necessário
    const pontuacaoTotal = respostas.reduce((acc, resposta) => {
      const valor = typeof resposta.valor === 'number' ? resposta.valor : parseInt(resposta.valor) || 0;
      return acc + valor;
    }, 0);

    const pontuacaoMaxima = perguntas.length * 5; // Assumindo escala 1-5
    const percentual = (pontuacaoTotal / pontuacaoMaxima) * 100;

    let nivel: 'baixo' | 'medio' | 'alto';
    if (percentual < 40) nivel = 'baixo';
    else if (percentual < 70) nivel = 'medio';
    else nivel = 'alto';

    return {
      dimensoes: {
        geral: {
          pontuacao: pontuacaoTotal,
          percentil: Math.round(percentual),
          interpretacao: this.getInterpretacao(nivel)
        }
      },
      pontuacao_geral: pontuacaoTotal,
      nivel,
      pontos_fortes: this.getPontosFortes(nivel),
      areas_desenvolvimento: this.getAreasDesenvolvimento(nivel)
    };
  },

  getInterpretacao(nivel: 'baixo' | 'medio' | 'alto'): string {
    const interpretacoes = {
      baixo: 'Resultado indica necessidade de desenvolvimento em várias áreas.',
      medio: 'Resultado mostra um desempenho equilibrado com oportunidades de melhoria.',
      alto: 'Resultado demonstra excelente desempenho na maioria das áreas avaliadas.'
    };
    return interpretacoes[nivel];
  },

  getPontosFortes(nivel: 'baixo' | 'medio' | 'alto'): string[] {
    const pontos = {
      baixo: ['Disposição para aprender', 'Potencial de crescimento'],
      medio: ['Equilíbrio geral', 'Base sólida para desenvolvimento'],
      alto: ['Excelente desempenho', 'Competências bem desenvolvidas', 'Potencial de liderança']
    };
    return pontos[nivel];
  },

  getAreasDesenvolvimento(nivel: 'baixo' | 'medio' | 'alto'): string[] {
    switch (nivel) {
      case 'baixo': return ['Desenvolver estratégias de melhoria', 'Buscar capacitação'];
      case 'medio': return ['Manter consistência', 'Aprimorar pontos específicos'];
      case 'alto': return ['Manter excelência', 'Compartilhar boas práticas'];
      default: return [];
    }
  }
};

// ==================== PROCESSAMENTO UNIFICADO ====================

export const processamentoService = {
  /**
   * Processa respostas de qualquer teste usando o service apropriado
   */
  async processarTesteCompleto(
    testeId: string,
    respostas: Record<number, number>,
    usuarioNome?: string,
    usuarioEmail?: string,
    tempoGasto: number = 0
  ): Promise<{ resultado: Resultado; analise: AnaliseResultado }> {
    
    // Validações básicas
    if (!testeId || !respostas || Object.keys(respostas).length === 0) {
      throw new Error('Dados inválidos para processamento');
    }

    try {
      // Determinar qual service usar baseado no teste
      switch (testeId) {
        case 'clima-organizacional':
          const resultadoClima = await climaOrganizacionalService.processarResultado(
            respostas, usuarioNome, usuarioEmail, tempoGasto
          );
          return {
            resultado: resultadoClima.resultado,
            analise: climaOrganizacionalService.converterParaAnaliseResultado(resultadoClima.analise)
          };

        case 'karasek-siegrist':
          const usuarioId = usuarioEmail || crypto.randomUUID();
          const resultadoKS = await karasekSiegristService.processarRespostas(usuarioId, respostas);
          return resultadoKS;

        default:
          // Para testes que ainda não têm service específico, usar processamento genérico
          return await this.processarTesteGenerico(testeId, respostas, usuarioNome, usuarioEmail, tempoGasto);
      }
    } catch (error) {
      console.error('❌ [DATABASE] Erro ao processar teste:', error);
      console.error('❌ [DATABASE] Tipo do erro:', typeof error);
      console.error('❌ [DATABASE] Nome do erro:', error instanceof Error ? error.name : 'Unknown');
      console.error('❌ [DATABASE] Mensagem do erro:', error instanceof Error ? error.message : String(error));
      console.error('❌ [DATABASE] Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
      
      // Re-throw o erro original em vez de mascarar
      throw error;
    }
  },

  /**
   * Processamento genérico para testes sem service específico
   */
  async processarTesteGenerico(
    testeId: string,
    respostas: Record<number, number>,
    usuarioNome?: string,
    usuarioEmail?: string,
    tempoGasto: number = 0
  ): Promise<{ resultado: Resultado; analise: AnaliseResultado }> {
    
    // Buscar informações do teste
    const teste = await testesService.buscarTestePorId(testeId);
    if (!teste) {
      throw new Error('Teste não encontrado');
    }

    // Buscar perguntas do teste
    const perguntas = await perguntasService.buscarPerguntasPorTeste(testeId);
    
    // Calcular pontuação total simples
    const valores = Object.values(respostas);
    const pontuacaoTotal = Math.round((valores.reduce((a, b) => a + b, 0) / valores.length) * 20);
    
    // Obter session_id para persistência
    const sessionId = sessionService.getSessionId();
    
    // CORREÇÃO: Garantir que usuario_id seja sempre preenchido baseado no usuário autenticado
    let usuarioIdFinal: string | null = null;
    
    // Tentar obter usuário autenticado
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      usuarioIdFinal = currentUser.id;
      console.log('🔍 [PROCESSAMENTO-GENERICO] Usuário autenticado encontrado:', {
        id: currentUser.id,
        email: currentUser.email,
        role: currentUser.role
      });
    } else {
      console.warn('⚠️ [PROCESSAMENTO-GENERICO] Nenhum usuário autenticado encontrado');
    }
    
    // Se não temos usuario_id do auth, usar o email como fallback (compatibilidade)
    if (!usuarioIdFinal && usuarioEmail) {
      usuarioIdFinal = usuarioEmail;
      console.log('🔍 [PROCESSAMENTO-GENERICO] Usando email como usuario_id (fallback):', usuarioEmail);
    }
    
    // Criar resultado
    const dadosResultado: Omit<Resultado, 'id' | 'data_realizacao'> = {
      teste_id: testeId,
      usuario_id: usuarioIdFinal, // Usar o ID real do usuário autenticado
      session_id: sessionId,
      pontuacao_total: pontuacaoTotal,
      tempo_gasto: tempoGasto,
      status: 'concluido',
      metadados: {
        tipo_teste: testeId,
        teste_nome: teste.nome,
        usuario_nome: usuarioNome,
        usuario_email: usuarioEmail,
        usuario_id_auth: usuarioIdFinal, // Manter referência ao ID real do usuário
        pontuacoes_dimensoes: {},
        interpretacao: analiseService.getInterpretacao(
          pontuacaoTotal < 40 ? 'baixo' : pontuacaoTotal < 70 ? 'medio' : 'alto'
        ),
        recomendacoes: analiseService.getAreasDesenvolvimento(
          pontuacaoTotal < 40 ? 'baixo' : pontuacaoTotal < 70 ? 'medio' : 'alto'
        ),
        versao_teste: '1.0',
        timestamp_processamento: new Date().toISOString()
      }
    };

    // Salvar resultado
    const resultado = await resultadosService.salvarResultado(dadosResultado);

    // Salvar respostas individuais
    const respostasArray: Omit<Resposta, 'id' | 'created_at'>[] = Object.entries(respostas).map(([perguntaId, valor]) => ({
      resultado_id: resultado.id,
      pergunta_id: parseInt(perguntaId),
      valor
    }));

    await respostasService.salvarRespostas(respostasArray);

    // Gerar análise
    const analise = analiseService.calcularAnalise(respostasArray as Resposta[], perguntas);

    return { resultado, analise };
  }
};