import express from 'express';
import { db } from '../../db';
import { colaboradores } from '../../shared/schema';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { eq } from 'drizzle-orm';

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

export default router;
