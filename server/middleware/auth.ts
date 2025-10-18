import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/auth';

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
  return requireRole('empresa', 'admin')(req, res, next);
}

export function requireColaborador(req: AuthRequest, res: Response, next: NextFunction) {
  return requireRole('colaborador', 'empresa', 'admin')(req, res, next);
}
