import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/auth';
import { db } from '../../db';
import { empresas, colaboradores } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

export function requireRole(...roles: ('admin' | 'empresa' | 'colaborador')[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  return requireRole('admin')(req, res, next);
}

export function requireEmpresa(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.role !== 'empresa') {
    return res.status(403).json({ error: 'Acesso negado: requer permissão de empresa' });
  }
  
  if (!req.user.empresaId) {
    return res.status(400).json({ error: 'EmpresaId ausente' });
  }
  
  next();
}

export function requireColaborador(req: AuthRequest, res: Response, next: NextFunction) {
  return requireRole('colaborador', 'empresa', 'admin')(req, res, next);
}

export async function checkEmpresaExpiration(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return next();
    }

    let empresaId: string | null = null;

    if (req.user.role === 'empresa') {
      empresaId = req.user.empresaId || null;
    } else if (req.user.role === 'colaborador') {
      const [colaborador] = await db
        .select({ empresaId: colaboradores.empresaId })
        .from(colaboradores)
        .where(eq(colaboradores.id, req.user.userId))
        .limit(1);
      
      empresaId = colaborador?.empresaId || null;
    }

    if (empresaId) {
      const [empresa] = await db
        .select({
          id: empresas.id,
          ativa: empresas.ativa,
          dataExpiracao: empresas.dataExpiracao,
        })
        .from(empresas)
        .where(eq(empresas.id, empresaId))
        .limit(1);

      if (!empresa) {
        return res.status(404).json({ 
          error: 'Empresa não encontrada',
          acessoBloqueado: true 
        });
      }

      if (empresa.dataExpiracao && new Date(empresa.dataExpiracao) < new Date()) {
        if (empresa.ativa) {
          await db
            .update(empresas)
            .set({ ativa: false })
            .where(eq(empresas.id, empresa.id));
          
          console.log(`🔒 Empresa ${empresa.id} bloqueada automaticamente por expiração`);
        }

        return res.status(403).json({ 
          error: 'Acesso expirado',
          message: 'O período de acesso da sua empresa ao sistema expirou. Entre em contato com o administrador.',
          dataExpiracao: empresa.dataExpiracao,
          acessoBloqueado: true
        });
      }

      if (!empresa.ativa) {
        return res.status(403).json({ 
          error: 'Acesso bloqueado',
          message: 'Sua empresa está com o acesso bloqueado. Entre em contato com o administrador.',
          acessoBloqueado: true
        });
      }
    }

    next();
  } catch (error) {
    console.error('❌ Erro ao verificar expiração da empresa:', error);
    next();
  }
}
