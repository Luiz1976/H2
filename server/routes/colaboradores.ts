import express from 'express';
import { db } from '../../db';
import { colaboradores } from '../../shared/schema';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const router = express.Router();

// Endpoint para colaborador obter seus próprios dados
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // Verificar se é um colaborador autenticado
    if (req.user?.role !== 'colaborador' || !req.user?.colaboradorId) {
      return res.status(403).json({ error: 'Acesso negado. Apenas colaboradores podem acessar este endpoint.' });
    }

    const [colaborador] = await db
      .select({
        id: colaboradores.id,
        nome: colaboradores.nome,
        email: colaboradores.email,
        cargo: colaboradores.cargo,
        departamento: colaboradores.departamento,
        avatar: colaboradores.avatar,
        empresaId: colaboradores.empresaId,
        permissoes: colaboradores.permissoes,
        ativo: colaboradores.ativo,
        createdAt: colaboradores.createdAt,
      })
      .from(colaboradores)
      .where(eq(colaboradores.id, req.user.colaboradorId))
      .limit(1);

    if (!colaborador) {
      return res.status(404).json({ error: 'Colaborador não encontrado' });
    }

    res.json({ colaborador });
  } catch (error) {
    console.error('Erro ao buscar dados do colaborador:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Schema de validação para atualização de colaborador
const updateColaboradorSchema = z.object({
  avatar: z.string().optional(),
  cargo: z.string().optional(),
  departamento: z.string().optional(),
  nome: z.string().optional(),
});

// Endpoint para atualizar dados do colaborador
router.patch('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Verificar se é um colaborador autenticado tentando atualizar seus próprios dados
    if (req.user?.role !== 'colaborador' || req.user?.colaboradorId !== id) {
      return res.status(403).json({ error: 'Acesso negado. Você só pode atualizar seus próprios dados.' });
    }

    // Validar dados de entrada
    const validationResult = updateColaboradorSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: 'Dados inválidos', details: validationResult.error.issues });
    }

    const updateData = validationResult.data;

    // Atualizar colaborador no banco
    const [updatedColaborador] = await db
      .update(colaboradores)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(colaboradores.id, id))
      .returning();

    if (!updatedColaborador) {
      return res.status(404).json({ error: 'Colaborador não encontrado' });
    }

    res.json({ 
      success: true, 
      colaborador: {
        id: updatedColaborador.id,
        nome: updatedColaborador.nome,
        email: updatedColaborador.email,
        cargo: updatedColaborador.cargo,
        departamento: updatedColaborador.departamento,
        avatar: updatedColaborador.avatar,
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar colaborador:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
