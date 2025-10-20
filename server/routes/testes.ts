import express from 'express';
import { db } from '../../db';
import { testes, perguntas, resultados, respostas, colaboradores, insertResultadoSchema, insertRespostaSchema } from '../../shared/schema';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { eq, and, desc, or } from 'drizzle-orm';
import { z } from 'zod';

const router = express.Router();

// Listar todos os testes disponíveis
router.get('/', async (req, res) => {
  try {
    const todosTestes = await db
      .select({
        id: testes.id,
        nome: testes.nome,
        descricao: testes.descricao,
        categoria: testes.categoria,
        tempoEstimado: testes.tempoEstimado,
        ativo: testes.ativo,
      })
      .from(testes)
      .where(eq(testes.ativo, true));

    res.json({ testes: todosTestes });
  } catch (error) {
    console.error('Erro ao listar testes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter detalhes de um teste específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [teste] = await db
      .select()
      .from(testes)
      .where(eq(testes.id, id))
      .limit(1);

    if (!teste) {
      return res.status(404).json({ error: 'Teste não encontrado' });
    }

    res.json({ teste });
  } catch (error) {
    console.error('Erro ao buscar teste:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter perguntas de um teste
router.get('/:id/perguntas', async (req, res) => {
  try {
    const { id } = req.params;

    const [teste] = await db.select().from(testes).where(eq(testes.id, id)).limit(1);
    if (!teste) {
      return res.status(404).json({ error: 'Teste não encontrado' });
    }

    const perguntasTeste = await db
      .select()
      .from(perguntas)
      .where(eq(perguntas.testeId, id))
      .orderBy(perguntas.ordem);

    res.json({ perguntas: perguntasTeste, total: perguntasTeste.length });
  } catch (error) {
    console.error('Erro ao buscar perguntas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Submeter resultado de teste (com autenticação)
router.post('/resultado', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const validationResult = z.object({
      testeId: z.string().uuid().nullable().optional(),
      pontuacaoTotal: z.number(),
      tempoGasto: z.number().optional(),
      sessionId: z.string().optional(),
      metadados: z.any().optional(),
      status: z.string().optional(),
    }).safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: 'Dados inválidos', details: validationResult.error.issues });
    }

    const { testeId, pontuacaoTotal, tempoGasto, sessionId, metadados, status } = validationResult.data;

    const [resultado] = await db
      .insert(resultados)
      .values({
        testeId: testeId || null,
        usuarioId: req.user!.userId,
        pontuacaoTotal,
        tempoGasto,
        status: status || 'concluido',
        sessionId,
        metadados,
        colaboradorId: req.user!.role === 'colaborador' ? req.user!.userId : undefined,
        empresaId: req.user!.empresaId,
        userEmail: req.user!.email,
      })
      .returning();

    res.status(201).json({
      message: 'Resultado salvo com sucesso',
      resultado: {
        id: resultado.id,
        pontuacaoTotal: resultado.pontuacaoTotal,
        dataRealizacao: resultado.dataRealizacao,
      },
    });
  } catch (error) {
    console.error('Erro ao salvar resultado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Submeter resultado de teste (SEM autenticação - para testes anônimos)
router.post('/resultado/anonimo', async (req, res) => {
  try {
    const validationResult = z.object({
      testeId: z.string().uuid().nullable().optional(),
      usuarioId: z.string().uuid().nullable().optional(),
      pontuacaoTotal: z.number(),
      tempoGasto: z.number().optional(),
      sessionId: z.string().optional(),
      metadados: z.any().optional(),
      status: z.string().optional(),
      userEmail: z.string().email().optional(),
      empresaId: z.string().uuid().nullable().optional(),
    }).safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: 'Dados inválidos', details: validationResult.error.issues });
    }

    const { testeId, usuarioId, pontuacaoTotal, tempoGasto, sessionId, metadados, status, userEmail, empresaId } = validationResult.data;

    const [resultado] = await db
      .insert(resultados)
      .values({
        testeId: testeId || null,
        usuarioId: usuarioId || null,
        pontuacaoTotal,
        tempoGasto,
        status: status || 'concluido',
        sessionId,
        metadados,
        userEmail: userEmail || null,
        empresaId: empresaId || null,
      })
      .returning();

    res.status(201).json({
      message: 'Resultado salvo com sucesso',
      resultado: {
        id: resultado.id,
        pontuacaoTotal: resultado.pontuacaoTotal,
        dataRealizacao: resultado.dataRealizacao,
      },
    });
  } catch (error) {
    console.error('Erro ao salvar resultado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter resultados do usuário
router.get('/resultados/meus', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // Busca por colaboradorId OU usuarioId (para compatibilidade) com JOIN para pegar nome do teste
    const meusResultados = await db
      .select({
        id: resultados.id,
        testeId: resultados.testeId,
        pontuacaoTotal: resultados.pontuacaoTotal,
        tempoGasto: resultados.tempoGasto,
        dataRealizacao: resultados.dataRealizacao,
        status: resultados.status,
        metadados: resultados.metadados,
        // Dados do teste
        testeNome: testes.nome,
        testeCategoria: testes.categoria,
      })
      .from(resultados)
      .leftJoin(testes, eq(resultados.testeId, testes.id))
      .where(
        or(
          eq(resultados.colaboradorId, req.user!.userId),
          eq(resultados.usuarioId, req.user!.userId)
        )
      )
      .orderBy(desc(resultados.dataRealizacao));

    // Enriquecer metadados com nome do teste se disponível
    const resultadosEnriquecidos = meusResultados.map(r => {
      const metadadosBase = r.metadados as Record<string, any> || {};
      const nomeTesteFinal = r.testeNome || metadadosBase.teste_nome || 'Teste Personalizado';
      
      return {
        id: r.id,
        testeId: r.testeId,
        pontuacaoTotal: r.pontuacaoTotal,
        tempoGasto: r.tempoGasto,
        dataRealizacao: r.dataRealizacao,
        status: r.status,
        metadados: {
          ...metadadosBase,
          teste_nome: nomeTesteFinal,
          teste_categoria: r.testeCategoria || metadadosBase.teste_categoria,
        },
        nomeTeste: nomeTesteFinal,
        categoria: r.testeCategoria || metadadosBase.teste_categoria,
      };
    });

    res.json({ resultados: resultadosEnriquecidos, total: resultadosEnriquecidos.length });
  } catch (error) {
    console.error('Erro ao buscar resultados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter detalhes de um resultado específico
router.get('/resultado/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Buscar resultado com JOIN nas tabelas de colaboradores e testes
    const [resultado] = await db
      .select({
        id: resultados.id,
        testeId: resultados.testeId,
        usuarioId: resultados.usuarioId,
        pontuacaoTotal: resultados.pontuacaoTotal,
        tempoGasto: resultados.tempoGasto,
        dataRealizacao: resultados.dataRealizacao,
        status: resultados.status,
        metadados: resultados.metadados,
        sessionId: resultados.sessionId,
        userAgent: resultados.userAgent,
        ipAddress: resultados.ipAddress,
        colaboradorId: resultados.colaboradorId,
        empresaId: resultados.empresaId,
        userEmail: resultados.userEmail,
        // Dados do colaborador
        colaboradorNome: colaboradores.nome,
        colaboradorCargo: colaboradores.cargo,
        colaboradorDepartamento: colaboradores.departamento,
        // Dados do teste
        testeNome: testes.nome,
        testeCategoria: testes.categoria,
      })
      .from(resultados)
      .leftJoin(colaboradores, eq(resultados.colaboradorId, colaboradores.id))
      .leftJoin(testes, eq(resultados.testeId, testes.id))
      .where(eq(resultados.id, id))
      .limit(1);

    if (!resultado) {
      return res.status(404).json({ error: 'Resultado não encontrado' });
    }

    // Verificar permissão: usuário pode ver se for dele ou da mesma empresa
    const temPermissao = 
      resultado.usuarioId === req.user!.userId ||
      resultado.colaboradorId === req.user!.userId ||
      (resultado.empresaId && resultado.empresaId === req.user!.empresaId) ||
      (req.user!.role === 'admin');

    if (!temPermissao) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const respostasResultado = await db
      .select()
      .from(respostas)
      .where(eq(respostas.resultadoId, id));

    // Enriquecer metadados com informações do colaborador
    const metadadosBase = resultado.metadados as Record<string, any> || {};
    const metadadosEnriquecidos = {
      ...metadadosBase,
      usuario_nome: resultado.colaboradorNome || metadadosBase.usuario_nome || 'Usuário',
      usuario_cargo: resultado.colaboradorCargo || metadadosBase.usuario_cargo || 'Não informado',
      usuario_departamento: resultado.colaboradorDepartamento || metadadosBase.usuario_departamento,
      teste_nome: resultado.testeNome || metadadosBase.teste_nome,
      teste_categoria: resultado.testeCategoria || metadadosBase.teste_categoria,
    };

    res.json({
      resultado: {
        ...resultado,
        metadados: metadadosEnriquecidos,
      },
      respostas: respostasResultado,
    });
  } catch (error) {
    console.error('Erro ao buscar resultado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
