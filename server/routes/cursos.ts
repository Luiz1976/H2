import express from 'express';
import { db } from '../db';
import { cursoProgresso, cursoAvaliacoes, cursoCertificados, colaboradores } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Obter progresso de um curso específico
router.get('/progresso/:cursoSlug', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { cursoSlug } = req.params;
    const colaboradorId = req.user?.userId;

    if (!colaboradorId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const progresso = await db.query.cursoProgresso.findFirst({
      where: and(
        eq(cursoProgresso.colaboradorId, colaboradorId),
        eq(cursoProgresso.cursoSlug, cursoSlug)
      )
    });

    if (!progresso) {
      return res.status(404).json({ error: 'Progresso não encontrado' });
    }

    return res.json(progresso);
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    return res.status(500).json({ error: 'Erro ao buscar progresso' });
  }
});

// Iniciar ou atualizar progresso de um curso
router.post('/progresso', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const colaboradorId = req.user?.userId;
    const { cursoId, cursoSlug, totalModulos } = req.body;

    if (!colaboradorId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    // Verificar se já existe progresso
    const progressoExistente = await db.query.cursoProgresso.findFirst({
      where: and(
        eq(cursoProgresso.colaboradorId, colaboradorId),
        eq(cursoProgresso.cursoId, cursoId)
      )
    });

    if (progressoExistente) {
      return res.json(progressoExistente);
    }

    // Criar novo progresso
    const [novoProgresso] = await db.insert(cursoProgresso).values({
      colaboradorId,
      cursoId,
      cursoSlug,
      totalModulos,
      modulosCompletados: [],
      progressoPorcentagem: 0,
    }).returning();

    return res.status(201).json(novoProgresso);
  } catch (error) {
    console.error('Erro ao criar progresso:', error);
    return res.status(500).json({ error: 'Erro ao criar progresso' });
  }
});

// Marcar módulo como completado
router.post('/progresso/:cursoSlug/modulo/:moduloId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { cursoSlug, moduloId } = req.params;
    const colaboradorId = req.user?.userId;

    if (!colaboradorId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const progresso = await db.query.cursoProgresso.findFirst({
      where: and(
        eq(cursoProgresso.colaboradorId, colaboradorId),
        eq(cursoProgresso.cursoSlug, cursoSlug)
      )
    });

    if (!progresso) {
      return res.status(404).json({ error: 'Progresso não encontrado' });
    }

    const modulosCompletadosArray = Array.isArray(progresso.modulosCompletados) 
      ? progresso.modulosCompletados 
      : [];
    
    // Adicionar módulo se ainda não foi completado
    if (!modulosCompletadosArray.includes(parseInt(moduloId))) {
      modulosCompletadosArray.push(parseInt(moduloId));
    }

    const novaProgresso = Math.round((modulosCompletadosArray.length / progresso.totalModulos) * 100);

    const [progressoAtualizado] = await db
      .update(cursoProgresso)
      .set({
        modulosCompletados: modulosCompletadosArray,
        progressoPorcentagem: novaProgresso,
        dataUltimaAtualizacao: new Date(),
        dataConclusao: modulosCompletadosArray.length === progresso.totalModulos ? new Date() : null,
      })
      .where(eq(cursoProgresso.id, progresso.id))
      .returning();

    return res.json(progressoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    return res.status(500).json({ error: 'Erro ao atualizar progresso' });
  }
});

// Submeter avaliação final
router.post('/avaliacao/:cursoSlug', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { cursoSlug } = req.params;
    const colaboradorId = req.user?.userId;
    const { cursoId, respostas, pontuacao, totalQuestoes, tempoGasto } = req.body;

    if (!colaboradorId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    // Verificar se todos os módulos foram completados
    const progresso = await db.query.cursoProgresso.findFirst({
      where: and(
        eq(cursoProgresso.colaboradorId, colaboradorId),
        eq(cursoProgresso.cursoSlug, cursoSlug)
      )
    });

    if (!progresso) {
      return res.status(400).json({ error: 'Complete todos os módulos antes da avaliação' });
    }

    const modulosCompletadosArray = Array.isArray(progresso.modulosCompletados) 
      ? progresso.modulosCompletados 
      : [];

    if (modulosCompletadosArray.length < progresso.totalModulos) {
      return res.status(400).json({ 
        error: 'Complete todos os módulos antes da avaliação',
        modulosCompletados: modulosCompletadosArray.length,
        totalModulos: progresso.totalModulos
      });
    }

    // Verificar se já realizou avaliação
    if (progresso.avaliacaoFinalRealizada) {
      return res.status(400).json({ error: 'Avaliação já realizada' });
    }

    // Aprovar se pontuação >= 70%
    const aprovado = pontuacao >= (totalQuestoes * 0.7);

    // Criar avaliação
    const [avaliacao] = await db.insert(cursoAvaliacoes).values({
      colaboradorId,
      cursoId,
      cursoSlug,
      respostas,
      pontuacao,
      totalQuestoes,
      aprovado,
      tempoGasto,
    }).returning();

    // Atualizar progresso com resultado da avaliação
    await db
      .update(cursoProgresso)
      .set({
        avaliacaoFinalRealizada: true,
        avaliacaoFinalPontuacao: pontuacao,
        dataUltimaAtualizacao: new Date(),
      })
      .where(eq(cursoProgresso.id, progresso.id));

    return res.status(201).json({ ...avaliacao, aprovado });
  } catch (error) {
    console.error('Erro ao salvar avaliação:', error);
    return res.status(500).json({ error: 'Erro ao salvar avaliação' });
  }
});

// Emitir certificado
router.post('/certificado/:cursoSlug', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { cursoSlug } = req.params;
    const colaboradorId = req.user?.userId;
    const { cursoId, cursoTitulo, cargaHoraria } = req.body;

    if (!colaboradorId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    // Verificar se avaliação foi aprovada
    const avaliacao = await db.query.cursoAvaliacoes.findFirst({
      where: and(
        eq(cursoAvaliacoes.colaboradorId, colaboradorId),
        eq(cursoAvaliacoes.cursoSlug, cursoSlug),
        eq(cursoAvaliacoes.aprovado, true)
      )
    });

    if (!avaliacao) {
      return res.status(400).json({ error: 'Avaliação não aprovada ou não realizada' });
    }

    // Verificar se certificado já existe
    const certificadoExistente = await db.query.cursoCertificados.findFirst({
      where: and(
        eq(cursoCertificados.colaboradorId, colaboradorId),
        eq(cursoCertificados.cursoSlug, cursoSlug)
      )
    });

    if (certificadoExistente) {
      return res.json(certificadoExistente);
    }

    // Buscar nome do colaborador
    const colaborador = await db.query.colaboradores.findFirst({
      where: eq(colaboradores.id, colaboradorId)
    });

    if (!colaborador) {
      return res.status(404).json({ error: 'Colaborador não encontrado' });
    }

    // Gerar código de autenticação único
    const codigoAutenticacao = `HQ-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Criar certificado
    const [certificado] = await db.insert(cursoCertificados).values({
      colaboradorId,
      cursoId,
      cursoSlug,
      cursoTitulo,
      colaboradorNome: colaborador.nome,
      cargaHoraria,
      codigoAutenticacao,
      qrCodeUrl: `${process.env.REPLIT_DEV_DOMAIN || 'https://humaniq.ai'}/validar-certificado/${codigoAutenticacao}`,
      assinaturaDigital: 'Dr. Carlos Silva - Diretor de Educação HumaniQ AI',
      validado: true,
    }).returning();

    return res.status(201).json(certificado);
  } catch (error) {
    console.error('Erro ao emitir certificado:', error);
    return res.status(500).json({ error: 'Erro ao emitir certificado' });
  }
});

// Buscar certificado por colaborador e curso
router.get('/certificado/:cursoSlug', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { cursoSlug } = req.params;
    const colaboradorId = req.user?.userId;

    if (!colaboradorId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const certificado = await db.query.cursoCertificados.findFirst({
      where: and(
        eq(cursoCertificados.colaboradorId, colaboradorId),
        eq(cursoCertificados.cursoSlug, cursoSlug)
      )
    });

    if (!certificado) {
      return res.status(404).json({ error: 'Certificado não encontrado' });
    }

    return res.json(certificado);
  } catch (error) {
    console.error('Erro ao buscar certificado:', error);
    return res.status(500).json({ error: 'Erro ao buscar certificado' });
  }
});

// Validar certificado (público)
router.get('/validar-certificado/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;

    const certificado = await db.query.cursoCertificados.findFirst({
      where: eq(cursoCertificados.codigoAutenticacao, codigo)
    });

    if (!certificado) {
      return res.status(404).json({ 
        valido: false, 
        mensagem: 'Certificado não encontrado' 
      });
    }

    return res.json({
      valido: certificado.validado,
      certificado: {
        cursoTitulo: certificado.cursoTitulo,
        colaboradorNome: certificado.colaboradorNome,
        cargaHoraria: certificado.cargaHoraria,
        dataEmissao: certificado.dataEmissao,
        codigoAutenticacao: certificado.codigoAutenticacao,
      }
    });
  } catch (error) {
    console.error('Erro ao validar certificado:', error);
    return res.status(500).json({ error: 'Erro ao validar certificado' });
  }
});

// Listar todos os certificados do colaborador
router.get('/meus-certificados', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const colaboradorId = req.user?.userId;

    if (!colaboradorId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const certificados = await db.query.cursoCertificados.findMany({
      where: eq(cursoCertificados.colaboradorId, colaboradorId)
    });

    return res.json(certificados);
  } catch (error) {
    console.error('Erro ao buscar certificados:', error);
    return res.status(500).json({ error: 'Erro ao buscar certificados' });
  }
});

export default router;
