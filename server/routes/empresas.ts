import express from 'express';
import { db } from '../../db';
import { empresas, colaboradores, convitesColaborador, resultados, testes } from '../../shared/schema';
import { authenticateToken, requireEmpresa, requireAdmin, AuthRequest } from '../middleware/auth';
import { eq, and, gt, desc, or } from 'drizzle-orm';

const router = express.Router();

// Obter detalhes da própria empresa
router.get('/me', authenticateToken, requireEmpresa, async (req: AuthRequest, res) => {
  try {
    const [empresa] = await db
      .select({
        id: empresas.id,
        nomeEmpresa: empresas.nomeEmpresa,
        emailContato: empresas.emailContato,
        configuracoes: empresas.configuracoes,
        ativa: empresas.ativa,
        createdAt: empresas.createdAt,
      })
      .from(empresas)
      .where(eq(empresas.id, req.user!.empresaId!))
      .limit(1);

    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    res.json({ empresa });
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar colaboradores da empresa
router.get('/colaboradores', authenticateToken, requireEmpresa, async (req: AuthRequest, res) => {
  try {
    const colaboradoresList = await db
      .select({
        id: colaboradores.id,
        nome: colaboradores.nome,
        email: colaboradores.email,
        cargo: colaboradores.cargo,
        departamento: colaboradores.departamento,
        ativo: colaboradores.ativo,
        createdAt: colaboradores.createdAt,
      })
      .from(colaboradores)
      .where(eq(colaboradores.empresaId, req.user!.empresaId!));

    res.json({ colaboradores: colaboradoresList, total: colaboradoresList.length });
  } catch (error) {
    console.error('Erro ao listar colaboradores:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar colaborador por ID
router.get('/colaboradores/:id', authenticateToken, requireEmpresa, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const [colaborador] = await db
      .select({
        id: colaboradores.id,
        nome: colaboradores.nome,
        email: colaboradores.email,
        cargo: colaboradores.cargo,
        departamento: colaboradores.departamento,
        ativo: colaboradores.ativo,
        createdAt: colaboradores.createdAt,
      })
      .from(colaboradores)
      .where(
        and(
          eq(colaboradores.id, id),
          eq(colaboradores.empresaId, req.user!.empresaId!)
        )
      )
      .limit(1);

    if (!colaborador) {
      return res.status(404).json({ error: 'Colaborador não encontrado' });
    }

    res.json({ colaborador });
  } catch (error) {
    console.error('Erro ao buscar colaborador:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar resultados de testes de um colaborador
router.get('/colaboradores/:id/resultados', authenticateToken, requireEmpresa, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o colaborador pertence à empresa
    const [colaborador] = await db
      .select()
      .from(colaboradores)
      .where(
        and(
          eq(colaboradores.id, id),
          eq(colaboradores.empresaId, req.user!.empresaId!)
        )
      )
      .limit(1);

    if (!colaborador) {
      return res.status(404).json({ error: 'Colaborador não encontrado' });
    }

    // Buscar resultados do colaborador com JOIN na tabela de testes
    // Busca por colaboradorId OU usuarioId (para compatibilidade com testes antigos)
    const resultadosList = await db
      .select({
        id: resultados.id,
        testeId: resultados.testeId,
        usuarioId: resultados.usuarioId,
        pontuacaoTotal: resultados.pontuacaoTotal,
        tempoGasto: resultados.tempoGasto,
        dataRealizacao: resultados.dataRealizacao,
        status: resultados.status,
        metadados: resultados.metadados,
        // Dados do teste
        testeNome: testes.nome,
        testeCategoria: testes.categoria,
        testeTempoEstimado: testes.tempoEstimado,
      })
      .from(resultados)
      .leftJoin(testes, eq(resultados.testeId, testes.id))
      .where(
        and(
          or(
            eq(resultados.colaboradorId, id),
            eq(resultados.usuarioId, id)
          ),
          eq(resultados.empresaId, req.user!.empresaId!)
        )
      )
      .orderBy(desc(resultados.dataRealizacao));

    // Enriquecer os resultados com informações formatadas
    const resultadosEnriquecidos = resultadosList.map(resultado => {
      const metadadosBase = resultado.metadados as Record<string, any> || {};
      
      // Calcular pontuação máxima e percentual
      const pontuacaoMaxima = metadadosBase.pontuacao_maxima || 100;
      const pontuacao = resultado.pontuacaoTotal || 0;
      const percentual = pontuacaoMaxima > 0 
        ? Math.round((pontuacao / pontuacaoMaxima) * 100) 
        : 0;
      
      return {
        id: resultado.id,
        testeId: resultado.testeId,
        nomeTest: resultado.testeNome || metadadosBase.teste_nome || 'Teste sem nome',
        categoria: resultado.testeCategoria || metadadosBase.teste_categoria || '',
        pontuacao: pontuacao,
        pontuacaoMaxima: pontuacaoMaxima,
        percentual: percentual,
        status: resultado.status || 'concluido',
        dataRealizacao: resultado.dataRealizacao,
        tempoDuracao: resultado.tempoGasto ? Math.round(resultado.tempoGasto / 60) : undefined, // converter segundos para minutos
        tipoTabela: metadadosBase.tipo_teste || '',
      };
    });

    res.json({ resultados: resultadosEnriquecidos, total: resultadosEnriquecidos.length });
  } catch (error) {
    console.error('Erro ao buscar resultados do colaborador:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Admin: listar todas as empresas
router.get('/todas', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const todasEmpresas = await db
      .select({
        id: empresas.id,
        nomeEmpresa: empresas.nomeEmpresa,
        emailContato: empresas.emailContato,
        ativa: empresas.ativa,
        createdAt: empresas.createdAt,
      })
      .from(empresas);

    res.json({ empresas: todasEmpresas, total: todasEmpresas.length });
  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar configurações da empresa
router.patch('/configuracoes', authenticateToken, requireEmpresa, async (req: AuthRequest, res) => {
  try {
    const { configuracoes } = req.body;

    if (!configuracoes || typeof configuracoes !== 'object') {
      return res.status(400).json({ error: 'Configurações inválidas' });
    }

    const [empresaAtualizada] = await db
      .update(empresas)
      .set({ configuracoes })
      .where(eq(empresas.id, req.user!.empresaId!))
      .returning();

    res.json({ empresa: empresaAtualizada });
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Estatísticas da empresa
router.get('/estatisticas', authenticateToken, requireEmpresa, async (req: AuthRequest, res) => {
  try {
    const empresaId = req.user!.empresaId!;

    // Buscar colaboradores
    const colaboradoresList = await db
      .select()
      .from(colaboradores)
      .where(eq(colaboradores.empresaId, empresaId));

    const totalColaboradores = colaboradoresList.length;
    const colaboradoresAtivos = colaboradoresList.filter(c => c.ativo).length;

    // Buscar convites pendentes
    const agora = new Date();
    const convitesList = await db
      .select()
      .from(convitesColaborador)
      .where(
        and(
          eq(convitesColaborador.empresaId, empresaId),
          eq(convitesColaborador.status, 'pendente'),
          gt(convitesColaborador.validade, agora)
        )
      );

    const convitesPendentes = convitesList.length;

    // Buscar resultados (se houver colaboradores)
    let totalTestesRealizados = 0;
    let testesEsteMes = 0;
    let mediaPontuacao = 0;

    if (colaboradoresList.length > 0) {
      const colaboradorIds = colaboradoresList.map(c => c.id);
      
      const resultadosList = await db
        .select()
        .from(resultados)
        .where(eq(resultados.empresaId, empresaId));

      const resultadosConcluidos = resultadosList.filter(r => r.status === 'concluido');
      totalTestesRealizados = resultadosConcluidos.length;

      // Testes deste mês
      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);

      testesEsteMes = resultadosConcluidos.filter(r => 
        r.dataRealizacao && new Date(r.dataRealizacao) >= inicioMes
      ).length;

      // Média de pontuação
      const pontuacoes = resultadosConcluidos
        .map(r => r.pontuacaoTotal)
        .filter(p => p !== null && p !== undefined) as number[];

      if (pontuacoes.length > 0) {
        mediaPontuacao = pontuacoes.reduce((acc, p) => acc + p, 0) / pontuacoes.length;
      }
    }

    res.json({
      estatisticas: {
        total_colaboradores: totalColaboradores,
        colaboradores_ativos: colaboradoresAtivos,
        total_testes_realizados: totalTestesRealizados,
        convites_pendentes: convitesPendentes,
        testes_este_mes: testesEsteMes,
        media_pontuacao: Math.round(mediaPontuacao * 10) / 10,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Análise psicossocial agregada da empresa (NR1 + LGPD compliant)
router.get('/estado-psicossocial', authenticateToken, requireEmpresa, async (req: AuthRequest, res) => {
  try {
    const empresaId = req.user!.empresaId!;

    // Buscar todos os colaboradores
    const colaboradoresList = await db
      .select()
      .from(colaboradores)
      .where(eq(colaboradores.empresaId, empresaId));

    // Buscar todos os resultados dos testes
    const resultadosList = await db
      .select({
        id: resultados.id,
        testeId: resultados.testeId,
        colaboradorId: resultados.colaboradorId,
        pontuacaoTotal: resultados.pontuacaoTotal,
        dataRealizacao: resultados.dataRealizacao,
        status: resultados.status,
        metadados: resultados.metadados,
        testeNome: testes.nome,
        testeCategoria: testes.categoria,
      })
      .from(resultados)
      .leftJoin(testes, eq(resultados.testeId, testes.id))
      .where(
        and(
          eq(resultados.empresaId, empresaId),
          eq(resultados.status, 'concluido')
        )
      )
      .orderBy(desc(resultados.dataRealizacao));

    // Calcular últimos 30 dias
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

    const resultadosRecentes = resultadosList.filter(r => 
      r.dataRealizacao && new Date(r.dataRealizacao) >= trintaDiasAtras
    );

    // Análise por dimensão psicossocial
    const dimensoesAgregadas: Record<string, { total: number; soma: number; nivel: string }> = {};
    const alertasCriticos: string[] = [];
    const riscosPsicossociais: Array<{ nome: string; nivel: string; percentual: number; descricao: string }> = [];

    // Processar metadados dos resultados
    resultadosList.forEach(resultado => {
      const metadados = resultado.metadados as Record<string, any> || {};
      const analiseCompleta = metadados.analise_completa || {};
      
      // Agregar dimensões
      if (analiseCompleta.dimensoes) {
        Object.entries(analiseCompleta.dimensoes).forEach(([dimensaoId, dados]: [string, any]) => {
          if (!dimensoesAgregadas[dimensaoId]) {
            dimensoesAgregadas[dimensaoId] = { total: 0, soma: 0, nivel: '' };
          }
          dimensoesAgregadas[dimensaoId].total++;
          dimensoesAgregadas[dimensaoId].soma += dados.percentual || dados.media || dados.pontuacao || 0;
        });
      }

      // Identificar alertas críticos
      if (metadados.alertas_criticos && Array.isArray(metadados.alertas_criticos)) {
        alertasCriticos.push(...metadados.alertas_criticos);
      }
    });

    // Calcular médias das dimensões
    const dimensoesAnalise = Object.entries(dimensoesAgregadas).map(([dimensaoId, dados]) => {
      const media = dados.total > 0 ? dados.soma / dados.total : 0;
      let nivel = 'Bom';
      let cor = 'green';
      
      if (media < 40) {
        nivel = 'Crítico';
        cor = 'red';
      } else if (media < 60) {
        nivel = 'Atenção';
        cor = 'orange';
      } else if (media < 75) {
        nivel = 'Moderado';
        cor = 'yellow';
      }

      return {
        dimensaoId,
        nome: dimensaoId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        percentual: Math.round(media),
        nivel,
        cor,
        total: dados.total
      };
    });

    // Análise NR1 - Fatores de Risco Psicossociais
    const nr1Fatores = [
      {
        fator: 'Carga de Trabalho',
        nivel: dimensoesAnalise.find(d => d.dimensaoId.includes('demanda') || d.dimensaoId.includes('estresse'))?.nivel || 'Não avaliado',
        percentual: dimensoesAnalise.find(d => d.dimensaoId.includes('demanda') || d.dimensaoId.includes('estresse'))?.percentual || 0
      },
      {
        fator: 'Autonomia e Controle',
        nivel: dimensoesAnalise.find(d => d.dimensaoId.includes('autonomia') || d.dimensaoId.includes('controle'))?.nivel || 'Não avaliado',
        percentual: dimensoesAnalise.find(d => d.dimensaoId.includes('autonomia') || d.dimensaoId.includes('controle'))?.percentual || 0
      },
      {
        fator: 'Suporte Social',
        nivel: dimensoesAnalise.find(d => d.dimensaoId.includes('suporte') || d.dimensaoId.includes('apoio'))?.nivel || 'Não avaliado',
        percentual: dimensoesAnalise.find(d => d.dimensaoId.includes('suporte') || d.dimensaoId.includes('apoio'))?.percentual || 0
      },
      {
        fator: 'Assédio e Violência',
        nivel: dimensoesAnalise.find(d => d.dimensaoId.includes('assedio') || d.dimensaoId.includes('moral'))?.nivel || 'Não avaliado',
        percentual: dimensoesAnalise.find(d => d.dimensaoId.includes('assedio') || d.dimensaoId.includes('moral'))?.percentual || 0
      },
      {
        fator: 'Equilíbrio Trabalho-Vida',
        nivel: dimensoesAnalise.find(d => d.dimensaoId.includes('equilibrio') || d.dimensaoId.includes('vida'))?.nivel || 'Não avaliado',
        percentual: dimensoesAnalise.find(d => d.dimensaoId.includes('equilibrio') || d.dimensaoId.includes('vida'))?.percentual || 0
      }
    ];

    // Calcular índice geral de bem-estar
    const indiceGeralBemEstar = dimensoesAnalise.length > 0
      ? Math.round(dimensoesAnalise.reduce((acc, d) => acc + d.percentual, 0) / dimensoesAnalise.length)
      : 0;

    // Compliance NR1
    const dataProximaAvaliacao = new Date();
    dataProximaAvaliacao.setMonth(dataProximaAvaliacao.getMonth() + 24); // NR1 exige reavaliação a cada 2 anos

    const nr1Compliance = {
      status: resultadosList.length > 0 ? 'Conforme' : 'Pendente',
      ultimaAvaliacao: resultadosList[0]?.dataRealizacao || null,
      proximaAvaliacao: dataProximaAvaliacao.toISOString(),
      testesRealizados: resultadosList.length,
      cobertura: colaboradoresList.length > 0 
        ? Math.round((new Set(resultadosList.map(r => r.colaboradorId)).size / colaboradoresList.length) * 100)
        : 0
    };

    // Recomendações baseadas em IA (análise dos padrões)
    const recomendacoes: Array<{ categoria: string; prioridade: string; titulo: string; descricao: string }> = [];

    if (indiceGeralBemEstar < 50) {
      recomendacoes.push({
        categoria: 'Urgente',
        prioridade: 'Alta',
        titulo: 'Intervenção Imediata Necessária',
        descricao: 'O índice de bem-estar está crítico. Recomenda-se ação imediata com programas de apoio psicológico e revisão das condições de trabalho.'
      });
    }

    if (nr1Fatores.some(f => f.nivel === 'Crítico')) {
      recomendacoes.push({
        categoria: 'NR1 Compliance',
        prioridade: 'Alta',
        titulo: 'Fatores de Risco Críticos Identificados',
        descricao: 'Foram identificados fatores de risco psicossociais críticos. Implemente medidas preventivas imediatas conforme NR1.'
      });
    }

    if (alertasCriticos.length > 0) {
      recomendacoes.push({
        categoria: 'Alertas Críticos',
        prioridade: 'Alta',
        titulo: 'Situações de Risco Detectadas',
        descricao: `${alertasCriticos.length} alerta(s) crítico(s) identificado(s). Ações disciplinares e educativas podem ser necessárias.`
      });
    }

    if (nr1Compliance.cobertura < 80) {
      recomendacoes.push({
        categoria: 'Cobertura',
        prioridade: 'Média',
        titulo: 'Aumentar Participação nos Testes',
        descricao: `Apenas ${nr1Compliance.cobertura}% dos colaboradores realizaram testes. Aumente a cobertura para melhor diagnóstico.`
      });
    }

    // Adicionar recomendações preventivas
    recomendacoes.push({
      categoria: 'Prevenção',
      prioridade: 'Média',
      titulo: 'Programas de Bem-Estar',
      descricao: 'Implemente programas regulares de mindfulness, atividades físicas e gestão de estresse.'
    });

    recomendacoes.push({
      categoria: 'Capacitação',
      prioridade: 'Média',
      titulo: 'Treinamento de Liderança',
      descricao: 'Capacite gestores em comunicação não-violenta, mediação de conflitos e inteligência emocional.'
    });

    res.json({
      analise: {
        indiceGeralBemEstar,
        totalColaboradores: colaboradoresList.length,
        totalTestesRealizados: resultadosList.length,
        testesUltimos30Dias: resultadosRecentes.length,
        cobertura: nr1Compliance.cobertura,
        dimensoes: dimensoesAnalise,
        nr1Fatores,
        nr1Compliance,
        alertasCriticos: [...new Set(alertasCriticos)].slice(0, 5), // Top 5 únicos
        recomendacoes,
        ultimaAtualizacao: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erro ao gerar análise psicossocial:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
