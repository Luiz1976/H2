// Servidor Express minimal para Render com baixo consumo de memória
// - Lazy loading de rotas
// - Logs simples
// - CORS básico
// - Endpoints críticos: /health e /api/auth

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';

// CORS básico (permitir apenas origens conhecidas)
const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:3000',
  'https://www.humaniqai.com.br',
  'https://humaniqai.com.br',
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    console.warn(`[CORS] Origem bloqueada: ${origin}`);
    cb(new Error('Não permitido pelo CORS'));
  },
  credentials: true,
}));

// Parsers com limite reduzido
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Logs mínimos
app.use((req, _res, next) => {
  // Log apenas método e path
  console.log(`[REQ] ${req.method} ${req.path}`);
  next();
});

// Health endpoints
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', environment: NODE_ENV, port: PORT, ts: new Date().toISOString() });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', environment: NODE_ENV, port: PORT, ts: new Date().toISOString() });
});

// Helper: lazy mount de rotas
function lazyRoute(path: string, loader: () => Promise<any>) {
  let router: any | null = null;
  let loading: Promise<any> | null = null;

  app.use(path, async (req, res, next) => {
    try {
      if (!router) {
        if (!loading) {
          console.log(`[LAZY] Carregando rota: ${path}`);
          loading = loader().then((mod) => {
            router = mod.default || mod;
            console.log(`[LAZY] Rota carregada: ${path}`);
            return router;
          }).catch((err) => {
            console.error(`[LAZY] Falha ao carregar rota ${path}:`, err);
            throw err;
          });
        }
        await loading;
      }
      // Encaminhar a requisição para o router carregado
      return router(req, res, next);
    } catch (err) {
      console.error(`[LAZY] Erro executando rota ${path}:`, err);
      res.status(500).json({ error: 'Erro interno ao carregar rota' });
    }
  });
}

// Endpoints críticos: autenticação (lazy)
lazyRoute('/api/auth', () => import('./routes/auth'));

// Demais rotas: lazy, apenas quando acessadas
lazyRoute('/api/testes', () => import('./routes/testes'));
lazyRoute('/api/empresas', () => import('./routes/empresas'));
lazyRoute('/api/colaboradores', () => import('./routes/colaboradores'));
lazyRoute('/api/convites', () => import('./routes/convites'));
lazyRoute('/api/admin', () => import('./routes/admin'));
lazyRoute('/api/chatbot', () => import('./routes/chatbot'));
lazyRoute('/api/stripe', () => import('./routes/stripe'));
lazyRoute('/api/erp', () => import('./routes/erp'));
lazyRoute('/api/teste-disponibilidade', () => import('./routes/teste-disponibilidade'));
lazyRoute('/api/curso-disponibilidade', () => import('./routes/curso-disponibilidade'));
lazyRoute('/api/cursos', () => import('./routes/cursos'));
lazyRoute('/api/email-test', () => import('./routes/email-test'));

// 404 mínimo
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado', path: req.originalUrl });
});

// Inicialização
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend minimal iniciado em http://0.0.0.0:${PORT} (${NODE_ENV})`);
});

// Encerramento gracioso
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Encerrando...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido. Encerr