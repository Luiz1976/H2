import { Router } from 'express';
import { db } from '../db';
import { erpConfigurations, colaboradores } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

const erpConfigSchema = z.object({
  erpType: z.string().min(1),
  apiUrl: z.string().url(),
  apiKey: z.string().min(1),
  apiSecret: z.string().optional(),
  configuracoes: z.any().optional(),
});

const importColaboradoresSchema = z.object({
  colaboradores: z.array(z.object({
    nome: z.string().min(1),
    email: z.string().email(),
    cargo: z.string().optional(),
    departamento: z.string().optional(),
  })),
});

router.post('/configure', async (req, res) => {
  try {
    const { empresaId } = req.body;
    
    if (!empresaId) {
      return res.status(400).json({ error: 'ID da empresa é obrigatório' });
    }

    const validatedData = erpConfigSchema.parse(req.body);

    const existingConfig = await db
      .select()
      .from(erpConfigurations)
      .where(eq(erpConfigurations.empresaId, empresaId))
      .limit(1);

    let result;
    
    if (existingConfig.length > 0) {
      result = await db
        .update(erpConfigurations)
        .set({
          ...validatedData,
          updatedAt: new Date(),
        })
        .where(eq(erpConfigurations.empresaId, empresaId))
        .returning();
    } else {
      result = await db
        .insert(erpConfigurations)
        .values({
          empresaId,
          ...validatedData,
        })
        .returning();
    }

    const config = result[0];
    const safeConfig = {
      ...config,
      apiKey: '***',
      apiSecret: config.apiSecret ? '***' : null,
    };

    res.json({ 
      success: true, 
      data: safeConfig,
      message: 'Configuração salva com sucesso'
    });
  } catch (error: any) {
    console.error('Erro ao configurar ERP:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }
    res.status(500).json({ error: 'Erro ao configurar ERP' });
  }
});

router.get('/configuration/:empresaId', async (req, res) => {
  try {
    const { empresaId } = req.params;

    const configs = await db
      .select()
      .from(erpConfigurations)
      .where(eq(erpConfigurations.empresaId, empresaId))
      .limit(1);

    if (configs.length === 0) {
      return res.json({ 
        success: true, 
        data: null,
        message: 'Nenhuma configuração encontrada'
      });
    }

    const config = configs[0];
    const safeConfig = {
      ...config,
      apiKey: '***',
      apiSecret: config.apiSecret ? '***' : null,
    };

    res.json({ success: true, data: safeConfig });
  } catch (error) {
    console.error('Erro ao buscar configuração ERP:', error);
    res.status(500).json({ error: 'Erro ao buscar configuração' });
  }
});

router.post('/test-connection', async (req, res) => {
  try {
    const { empresaId } = req.body;

    if (!empresaId) {
      return res.status(400).json({ error: 'ID da empresa é obrigatório' });
    }

    const configs = await db
      .select()
      .from(erpConfigurations)
      .where(eq(erpConfigurations.empresaId, empresaId))
      .limit(1);

    if (configs.length === 0) {
      return res.status(404).json({ error: 'Configuração não encontrada' });
    }

    const config = configs[0];

    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (config.erpType === 'TOTVS') {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    } else if (config.erpType === 'SAP') {
      headers['APIKey'] = config.apiKey;
    } else {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }

    const testEndpoint = `${config.apiUrl}/health`;
    
    try {
      const response = await fetch(testEndpoint, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(10000),
      });

      const statusConexao = response.ok ? 'conectado' : 'erro';

      await db
        .update(erpConfigurations)
        .set({
          statusConexao,
          updatedAt: new Date(),
        })
        .where(eq(erpConfigurations.id, config.id));

      if (response.ok) {
        return res.json({
          success: true,
          message: 'Conexão estabelecida com sucesso!',
          status: statusConexao,
        });
      } else {
        return res.status(400).json({
          success: false,
          error: 'Falha ao conectar com o ERP',
          status: statusConexao,
        });
      }
    } catch (fetchError: any) {
      await db
        .update(erpConfigurations)
        .set({
          statusConexao: 'erro',
          updatedAt: new Date(),
        })
        .where(eq(erpConfigurations.id, config.id));

      return res.status(500).json({
        success: false,
        error: 'Erro ao testar conexão',
        details: fetchError.message,
      });
    }
  } catch (error: any) {
    console.error('Erro ao testar conexão:', error);
    res.status(500).json({ error: 'Erro ao testar conexão' });
  }
});

router.post('/import-colaboradores', async (req, res) => {
  try {
    const { empresaId } = req.body;

    if (!empresaId) {
      return res.status(400).json({ error: 'ID da empresa é obrigatório' });
    }

    const configs = await db
      .select()
      .from(erpConfigurations)
      .where(eq(erpConfigurations.empresaId, empresaId))
      .limit(1);

    if (configs.length === 0) {
      return res.status(404).json({ error: 'Configuração ERP não encontrada' });
    }

    const config = configs[0];

    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (config.erpType === 'TOTVS') {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    } else if (config.erpType === 'SAP') {
      headers['APIKey'] = config.apiKey;
    } else {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }

    const employeesEndpoint = `${config.apiUrl}/api/v1/employees`;

    try {
      const response = await fetch(employeesEndpoint, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        throw new Error(`ERP retornou status ${response.status}`);
      }

      const data = await response.json();
      
      const employeesList = data.employees || data.data || data;

      if (!Array.isArray(employeesList) || employeesList.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Nenhum colaborador encontrado no ERP',
        });
      }

      const colaboradoresParaImportar = employeesList.map((emp: any) => ({
        nome: emp.name || emp.nome || emp.full_name || 'Nome não informado',
        email: emp.email || emp.email_address || `${emp.id}@empresa.com`,
        cargo: emp.position || emp.cargo || emp.job_title || null,
        departamento: emp.department || emp.departamento || emp.area || null,
        empresaId,
        senha: Math.random().toString(36).slice(-12),
        ativo: true,
      }));

      const importedColaboradores: any[] = [];
      const errors: any[] = [];

      for (const colaborador of colaboradoresParaImportar) {
        try {
          const existing = await db
            .select()
            .from(colaboradores)
            .where(eq(colaboradores.email, colaborador.email))
            .limit(1);

          if (existing.length === 0) {
            const result = await db
              .insert(colaboradores)
              .values(colaborador)
              .returning();
            
            importedColaboradores.push(result[0]);
          } else {
            errors.push({
              email: colaborador.email,
              error: 'Colaborador já existe',
            });
          }
        } catch (error: any) {
          errors.push({
            email: colaborador.email,
            error: error.message,
          });
        }
      }

      await db
        .update(erpConfigurations)
        .set({
          ultimaSincronizacao: new Date(),
          statusConexao: 'conectado',
          updatedAt: new Date(),
        })
        .where(eq(erpConfigurations.id, config.id));

      res.json({
        success: true,
        message: `${importedColaboradores.length} colaboradores importados com sucesso`,
        data: {
          imported: importedColaboradores.length,
          total: colaboradoresParaImportar.length,
          errors: errors.length,
          errorDetails: errors,
        },
      });
    } catch (fetchError: any) {
      console.error('Erro ao buscar colaboradores do ERP:', fetchError);
      return res.status(500).json({
        success: false,
        error: 'Erro ao buscar dados do ERP',
        details: fetchError.message,
      });
    }
  } catch (error: any) {
    console.error('Erro ao importar colaboradores:', error);
    res.status(500).json({ error: 'Erro ao importar colaboradores' });
  }
});

router.delete('/configuration/:empresaId', async (req, res) => {
  try {
    const { empresaId } = req.params;

    await db
      .delete(erpConfigurations)
      .where(eq(erpConfigurations.empresaId, empresaId));

    res.json({ 
      success: true, 
      message: 'Configuração removida com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover configuração:', error);
    res.status(500).json({ error: 'Erro ao remover configuração' });
  }
});

export default router;
