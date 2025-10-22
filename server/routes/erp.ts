import { Router } from 'express';
import { db } from '../db';
import { colaboradores, convitesColaborador } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const router = Router();

// URLs pré-configuradas para cada tipo de ERP
const ERP_API_URLS: Record<string, string> = {
  TOTVS: 'https://api.totvs.com.br/protheus/rest',
  SAP: 'https://api.sap.com/s4hana/v1',
  ORACLE: 'https://api.oracle.com/cloud/erp/v1',
  MICROSOFT: 'https://api.dynamics.com/v9.0',
  SENIOR: 'https://api.senior.com.br/rest',
  LINX: 'https://api.linx.com.br/v1',
  SANKHYA: 'https://api.sankhya.com.br/gateway',
  BENNER: 'https://api.benner.com.br/rest',
  OUTRO: 'https://api.customizado.com.br', // URL genérica para customizações
};

function getErpApiUrl(erpType: string): string {
  return ERP_API_URLS[erpType] || ERP_API_URLS.OUTRO;
}

const erpLoginSchema = z.object({
  empresaId: z.string(),
  erpType: z.string().min(1),
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
    const { empresaId, erpType, username, password } = validatedData;

    // Usa URL pré-configurada baseada no tipo de ERP
    const apiUrl = getErpApiUrl(erpType);
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

// Endpoint para testar conectividade com todos os ERPs
router.get('/test-connections', async (req, res) => {
  try {
    const testResults: any[] = [];
    const erpTypes = Object.keys(ERP_API_URLS);

    console.log('🧪 Iniciando testes de conexão com ERPs...');

    for (const erpType of erpTypes) {
      const startTime = Date.now();
      const apiUrl = getErpApiUrl(erpType);
      const testEndpoint = `${apiUrl}/api/v1/health`;
      
      let result = {
        erpType,
        apiUrl,
        status: 'unknown',
        responseTime: 0,
        statusCode: 0,
        message: '',
        details: '',
        timestamp: new Date().toISOString(),
      };

      try {
        console.log(`🔍 Testando ${erpType} em ${apiUrl}...`);
        
        const response = await fetch(testEndpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'HumaniQ-ERP-Integration-Test/1.0',
          },
          signal: AbortSignal.timeout(5000),
        });

        const endTime = Date.now();
        result.responseTime = endTime - startTime;
        result.statusCode = response.status;

        if (response.ok) {
          result.status = 'online';
          result.message = 'Conexão estabelecida com sucesso';
          console.log(`✅ ${erpType}: ONLINE (${result.responseTime}ms)`);
        } else if (response.status === 401 || response.status === 403) {
          result.status = 'autenticação_necessária';
          result.message = 'API acessível, mas requer autenticação';
          result.details = `Status ${response.status} - Autenticação necessária`;
          console.log(`🔐 ${erpType}: REQUER AUTH (${result.responseTime}ms)`);
        } else if (response.status === 404) {
          result.status = 'endpoint_não_encontrado';
          result.message = 'URL configurada, mas endpoint de teste não existe';
          result.details = 'Pode ser necessário ajustar o endpoint de teste';
          console.log(`❓ ${erpType}: ENDPOINT NÃO ENCONTRADO (${result.responseTime}ms)`);
        } else {
          result.status = 'erro_http';
          result.message = `Erro HTTP ${response.status}`;
          result.details = response.statusText;
          console.log(`⚠️ ${erpType}: ERRO HTTP ${response.status} (${result.responseTime}ms)`);
        }

      } catch (error: any) {
        const endTime = Date.now();
        result.responseTime = endTime - startTime;

        if (error.name === 'AbortError') {
          result.status = 'timeout';
          result.message = 'Tempo limite excedido (5s)';
          result.details = 'Servidor não respondeu no tempo esperado';
          console.log(`⏱️ ${erpType}: TIMEOUT (${result.responseTime}ms)`);
        } else if (error.cause?.code === 'ENOTFOUND') {
          result.status = 'dns_falhou';
          result.message = 'Domínio não encontrado';
          result.details = 'DNS não conseguiu resolver o domínio';
          console.log(`🌐 ${erpType}: DNS FALHOU`);
        } else if (error.cause?.code === 'ECONNREFUSED') {
          result.status = 'conexão_recusada';
          result.message = 'Conexão recusada pelo servidor';
          result.details = 'Servidor pode estar offline ou com firewall';
          console.log(`🚫 ${erpType}: CONEXÃO RECUSADA`);
        } else {
          result.status = 'erro';
          result.message = 'Erro ao tentar conectar';
          result.details = error.message || 'Erro desconhecido';
          console.log(`❌ ${erpType}: ERRO - ${error.message}`);
        }
      }

      testResults.push(result);
    }

    // Estatísticas gerais
    const stats = {
      total: testResults.length,
      online: testResults.filter(r => r.status === 'online').length,
      autenticação_necessária: testResults.filter(r => r.status === 'autenticação_necessária').length,
      endpoint_não_encontrado: testResults.filter(r => r.status === 'endpoint_não_encontrado').length,
      timeout: testResults.filter(r => r.status === 'timeout').length,
      dns_falhou: testResults.filter(r => r.status === 'dns_falhou').length,
      conexão_recusada: testResults.filter(r => r.status === 'conexão_recusada').length,
      erro_http: testResults.filter(r => r.status === 'erro_http').length,
      erro: testResults.filter(r => r.status === 'erro').length,
      tempoMedio: Math.round(testResults.reduce((acc, r) => acc + r.responseTime, 0) / testResults.length),
    };

    console.log('📊 Relatório Final:');
    console.log(`   Total: ${stats.total} ERPs testados`);
    console.log(`   ✅ Online: ${stats.online}`);
    console.log(`   🔐 Requer Auth: ${stats.autenticação_necessária}`);
    console.log(`   ❓ Endpoint não encontrado: ${stats.endpoint_não_encontrado}`);
    console.log(`   ⏱️ Timeout: ${stats.timeout}`);
    console.log(`   🌐 DNS Falhou: ${stats.dns_falhou}`);
    console.log(`   🚫 Conexão Recusada: ${stats.conexão_recusada}`);
    console.log(`   ⚠️ Erro HTTP: ${stats.erro_http}`);
    console.log(`   ❌ Outros Erros: ${stats.erro}`);
    console.log(`   ⚡ Tempo Médio: ${stats.tempoMedio}ms`);

    return res.json({
      success: true,
      message: 'Testes de conexão concluídos',
      timestamp: new Date().toISOString(),
      stats,
      results: testResults,
    });

  } catch (error: any) {
    console.error('❌ Erro ao testar conexões ERP:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao executar testes de conexão',
      message: error.message,
    });
  }
});

export default router;
