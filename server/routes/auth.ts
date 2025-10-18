import express from 'express';
import { db } from '../../db';
import { admins, empresas, colaboradores, insertAdminSchema } from '../../shared/schema';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/login', async (req, res) => {
  try {
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: 'Invalid request', details: validationResult.error.issues });
    }

    const { email, password } = validationResult.data;

    let user;
    let role: 'admin' | 'empresa' | 'colaborador';
    let empresaId: string | undefined;

    const [admin] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
    if (admin) {
      const validPassword = await comparePassword(password, admin.senha);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      user = admin;
      role = 'admin';
    } else {
      const [empresa] = await db.select().from(empresas).where(eq(empresas.emailContato, email)).limit(1);
      if (empresa) {
        const validPassword = await comparePassword(password, empresa.senha);
        if (!validPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        user = empresa;
        role = 'empresa';
        empresaId = empresa.id;
      } else {
        const [colaborador] = await db.select().from(colaboradores).where(eq(colaboradores.email, email)).limit(1);
        if (colaborador) {
          const validPassword = await comparePassword(password, colaborador.senha);
          if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
          }
          user = colaborador;
          role = 'colaborador';
          empresaId = colaborador.empresaId || undefined;
        } else {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
      }
    }

    const token = generateToken({
      userId: user.id,
      email: user.email || (user as any).emailContato,
      role,
      empresaId,
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email || (user as any).emailContato,
        nome: user.nome || (user as any).nomeEmpresa,
        role,
        empresaId,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/register/admin', async (req, res) => {
  try {
    const validationResult = insertAdminSchema.extend({
      senha: z.string().min(8),
    }).safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: 'Invalid request', details: validationResult.error.issues });
    }

    const { email, nome, senha } = validationResult.data;

    const [existing] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
    if (existing) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await hashPassword(senha);

    const [newAdmin] = await db
      .insert(admins)
      .values({
        email,
        nome,
        senha: hashedPassword,
      })
      .returning();

    const token = generateToken({
      userId: newAdmin.id,
      email: newAdmin.email,
      role: 'admin',
    });

    res.status(201).json({
      token,
      user: {
        id: newAdmin.id,
        email: newAdmin.email,
        nome: newAdmin.nome,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
