import { Router } from 'express';
import { db } from '../db';
import { colaboradores, convitesColaborador } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const router = Router();

const erpLoginSchema = z.object({
  empresaId: z.string(),
  erpType: z.string().min(1),
  apiUrl: z.string().url(),
  username: z.string().min(1),
  password: z.string().min(1),
});

const bulkInviteSchema = z.object({
  empresaId: z.string(),
  colaboradores: z.array(z.object({
    nome: z.string().min(1),
    email: z.string().email(),
    cargo: z.string().optional(),
    departamento: z.string().optional(),
    sexo: z.string().optional(),
  })),
});

function getAuthHeaders(erpType: string, username: string, password: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  switch (erpType) {
    case 'TOTVS':
      const totvsAuth = Buffer.from(`${username}:${password}`).toString('base64');
      headers['Authorization'] = `Basic ${totvsAuth}`;
      break;
    
    case 'SAP':
      headers['Authorization'] = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
      headers['APIKey'] = username;
      break;
    
    case 'ORACLE':
      headers['Authorization'] = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
      break;
    
    case 'MICROSOFT':
      headers['Authorization'] = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
      break;
    
    default:
      headers['Authorization'] = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
  }

  return headers;
}

function normalizeColaboradorData(rawData: any): any[] {
  if (!rawData) return [];
  
  const employees = rawData.employees || rawData.colaboradores || rawData.data || rawData.results || [];
  
  if (!Array.isArray(employees)) {
    return [];
  }

  return employees.map((emp: any) => ({
    nome: emp.name || emp.nome || emp.full_name || emp.fullName || '',
    email: emp.email || emp.email_address || emp.emailAddress || '',
    cargo: emp.position || emp.cargo || emp.job_title || emp.jobTitle || '',
    departamento: emp.department || emp.departamento || emp.area || emp.setor || '',
    sexo: emp.gender || emp.sexo || emp.sex || '',
  })).filter((col: any) => col.nome && col.email);
}

router.post('/login-and-fetch', async (req, res) => {
  try {
    const validatedData = erpLoginSchema.parse(req.body);
    const { empresaId, erpType, apiUrl, username, password } = validatedData;

    const headers = getAuthHeaders(erpType, username, password);

    const employeesEndpoint = `${apiUrl}/api/v1/employees`;
    
    try {
      const response = await fetch(employeesEndpoint, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        return res.status(401).json({
          success: false,
          error: 'Falha na autenticação com o ERP',
          details: `Status: ${response.status} - ${response.statusText}`,
        });
      }

      const rawData = await response.json();
      const colaboradores = normalizeColaboradorData(rawData);

      if (colaboradores.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Nenhum colaborador encontrado no ERP',
          message: 'Verifique se existem funcionários cadastrados no sistema ERP',
        });
      }

      return res.json({
        success: true,
        message: `${colaboradores.length} colaboradores encontrados`,
        data: {
          erpType,
          totalColaboradores: colaboradores.length,
          colaboradores,
        },
      });

    } catch (fetchError: any) {
      console.error('Erro ao buscar colaboradores do ERP:', fetchError);
      
      if (fetchError.name === 'AbortError') {
        return res.status(504).json({
          success: false,
          error: 'Tempo limite excedido ao conectar com o ERP',
          message: 'Verifique a URL e conectividade do sistema',
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Erro ao conectar com o ERP',
        details: fetchError.message,
      });
    }

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors,
      });
    }

    console.error('Erro no login ERP:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message,
    });
  }
});

router.post('/bulk-invite', async (req, res) => {
  try {
    const validatedData = bulkInviteSchema.parse(req.body);
    const { empresaId, colaboradores: colaboradoresParaConvidar } = validatedData;

    const results = {
      invited: 0,
      skipped: 0,
      errors: 0,
      details: [] as any[],
    };

    for (const colaborador of colaboradoresParaConvidar) {
      try {
        const existingColaborador = await db
          .select()
          .from(colaboradores)
          .where(
            eq(colaboradores.email, colaborador.email.toLowerCase())
          )
          .limit(1);

        if (existingColaborador.length > 0) {
          results.skipped++;
          results.details.push({
            email: colaborador.email,
            status: 'skipped',
            message: 'Colaborador já cadastrado',
          });
          continue;
        }

        const existingInvite = await db
          .select()
          .from(convitesColaborador)
          .where(
            eq(convitesColaborador.email, colaborador.email.toLowerCase())
          )
          .limit(1);

        if (existingInvite.length > 0 && existingInvite[0].status === 'pendente') {
          results.skipped++;
          results.details.push({
            email: colaborador.email,
            status: 'skipped',
            message: 'Convite pendente já existe',
          });
          continue;
        }

        const token = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
        
        const validade = new Date();
        validade.setDate(validade.getDate() + 7);

        await db.insert(convitesColaborador).values({
          empresaId,
          nome: colaborador.nome,
          email: colaborador.email.toLowerCase(),
          cargo: colaborador.cargo || null,
          departamento: colaborador.departamento || null,
          token,
          validade,
          status: 'pendente',
        });

        results.invited++;
        results.details.push({
          email: colaborador.email,
          status: 'invited',
          message: 'Convite criado com sucesso',
        });

      } catch (error: any) {
        console.error(`Erro ao criar convite para ${colaborador.email}:`, error);
        results.errors++;
        results.details.push({
          email: colaborador.email,
          status: 'error',
          message: error.message || 'Erro desconhecido',
        });
      }
    }

    return res.json({
      success: true,
      message: `${results.invited} convites criados, ${results.skipped} ignorados, ${results.errors} erros`,
      data: results,
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors,
      });
    }

    console.error('Erro ao criar convites em massa:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message,
    });
  }
});

export default router;
