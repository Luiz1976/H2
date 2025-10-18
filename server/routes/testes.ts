import express from 'express';
import { db } from '../../db';
import { testes, perguntas, resultados, respostas, insertResultadoSchema, insertRespostaSchema } from '../../shared/schema';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { eq, and, desc } from 'drizzle-orm';
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

// Submeter resultado de teste
router.post('/resultado', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const validationResult = z.object({
      testeId: z.string().uuid(),
      respostas: z.array(z.object({
        perguntaId: z.string().uuid(),
        valor: z.string(),
        pontuacao: z.number().optional(),
      })),
      tempoGasto: z.number().optional(),
      sessionId: z.string().optional(),
    }).safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: 'Dados inválidos', details: validationResult.error.issues });
    }

    const { testeId, respostas: respostasData, tempoGasto, sessionId } = validationResult.data;

    const pontuacaoTotal = respostasData.reduce((sum, r) => sum + (r.pontuacao || 0), 0);

    const [resultado] = await db
      .insert(resultados)
      .values({
        testeId,
        usuarioId: req.user!.userId,
        pontuacaoTotal,
        tempoGasto,
        status: 'concluido',
        sessionId,
        colaboradorId: req.user!.role === 'colaborador' ? req.user!.userId : undefined,
        empresaId: req.user!.empresaId,
        userEmail: req.user!.email,
      })
      .returning();

    for (const resposta of respostasData) {
      await db.insert(respostas).values({
        resultadoId: resultado.id,
        perguntaId: resposta.perguntaId,
        valor: resposta.valor,
        pontuacao: resposta.pontuacao,
      });
    }

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
    const meusResultados = await db
      .select({
        id: resultados.id,
        testeId: resultados.testeId,
        pontuacaoTotal: resultados.pontuacaoTotal,
        tempoGasto: resultados.tempoGasto,
        dataRealizacao: resultados.dataRealizacao,
        status: resultados.status,
      })
      .from(resultados)
      .where(eq(resultados.usuarioId, req.user!.userId))
      .orderBy(desc(resultados.dataRealizacao));

    res.json({ resultados: meusResultados, total: meusResultados.length });
  } catch (error) {
    console.error('Erro ao buscar resultados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter detalhes de um resultado específico
router.get('/resultado/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const [resultado] = await db
      .select()
      .from(resultados)
      .where(
        and(
          eq(resultados.id, id),
          eq(resultados.usuarioId, req.user!.userId)
        )
      )
      .limit(1);

    if (!resultado) {
      return res.status(404).json({ error: 'Resultado não encontrado' });
    }

    const respostasResultado = await db
      .select()
      .from(respostas)
      .where(eq(respostas.resultadoId, id));

    res.json({
      resultado,
      respostas: respostasResultado,
    });
  } catch (error) {
    console.error('Erro ao buscar resultado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
