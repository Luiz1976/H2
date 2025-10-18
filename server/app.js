// app.js
// Aplicação Express principal para API de convites

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { 
  helmetConfig, 
  rateLimiter, 
  requestLogger, 
  errorHandler 
} from './middleware/security.js';
import { verificarConexao } from './config/supabase.js';
import invitationsRouter from './routes/invitations.js';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ========================================
// MIDDLEWARE DE SEGURANÇA
// ========================================

// Helmet para segurança de headers HTTP
app.use(helmetConfig);

// CORS configurado
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
};

app.use(cors(corsOptions));

// Rate limiting geral
app.use(rateLimiter);

// Parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger de requisições
app.use(requestLogger);

// Trust proxy (importante para rate limiting e logs de IP)
app.set('trust proxy', 1);

// ========================================
// ROTAS PRINCIPAIS
// ========================================

// Rota de health check geral
app.get('/health', async (req, res) => {
  try {
    // Verificar conexão com Supabase
    const supabaseStatus = await verificarConexao();
    
    res.json({
      success: true,
      message: 'API funcionando',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        supabase: supabaseStatus ? 'conectado' : 'desconectado'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro no health check',
      error: error.message
    });
  }
});

// Rotas de convites
app.use('/api/invitations', invitationsRouter);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Convites Humaniq',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      invitations: '/api/invitations',
      docs: 'Em desenvolvimento'
    }
  });
});

// ========================================
// MIDDLEWARE DE ERRO
// ========================================

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado',
    path: req.originalUrl,
    method: req.method
  });
});

// Handler de erros global
app.use(errorHandler);

// ========================================
// INICIALIZAÇÃO DO SERVIDOR
// ========================================

const iniciarServidor = async () => {
  try {
    // Verificar variáveis de ambiente obrigatórias
    const variaveisObrigatorias = [
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'API_SECRET_KEY'
    ];

    const variaveisFaltando = variaveisObrigatorias.filter(
      variavel => !process.env[variavel]
    );

    if (variaveisFaltando.length > 0) {
      console.error('❌ Variáveis de ambiente faltando:', variaveisFaltando);
      process.exit(1);
    }

    // Verificar conexão com Supabase
    console.log('🔍 Verificando conexão com Supabase...');
    const supabaseConectado = await verificarConexao();
    
    if (!supabaseConectado) {
      console.error('❌ Falha na conexão com Supabase');
      process.exit(1);
    }

    console.log('✅ Conexão com Supabase estabelecida');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('🚀 Servidor iniciado com sucesso!');
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔒 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
      console.log('📋 Endpoints disponíveis:');
      console.log('   GET  /health');
      console.log('   GET  /api/invitations/health');
      console.log('   POST /api/invitations/empresa');
      console.log('   POST /api/invitations/colaborador');
      console.log('   GET  /api/invitations/token/:token');
      console.log('   GET  /api/invitations/list');
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Erro não capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejeitada não tratada:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Recebido SIGTERM, encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Recebido SIGINT, encerrando servidor...');
  process.exit(0);
});

// Iniciar o servidor
iniciarServidor();

export default app;