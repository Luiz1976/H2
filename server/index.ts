import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import logger, { logRequest } from './utils/logger';
import authRouter from './routes/auth';
import convitesRouter from './routes/convites';
import empresasRouter from './routes/empresas';
import testesRouter from './routes/testes';
import colaboradoresRouter from './routes/colaboradores';
import erpRouter from './routes/erp';
import testeDisponibilidadeRouter from './routes/teste-disponibilidade';
import cursoDisponibilidadeRouter from './routes/curso-disponibilidade';
import stripeRouter from './routes/stripe';
import adminRouter from './routes/admin';
import chatbotRouter from './routes/chatbot';
import emailTestRouter from './routes/email-test';
import cursosRouter from './routes/cursos';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Muitas requisições deste IP, por favor tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Muitas tentativas de login, por favor tente novamente em 15 minutos.',
  skipSuccessfulRequests: true,
});

const allowedOrigins = [
  'http://localhost:5000',
  'https://08104fec-88a3-487a-ac1e-cdc4db92eb97-00-2yraann2v6dea.riker.replit.dev:5000',
  process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));

app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(logRequest);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: 'connected'
  });
});

app.use('/api/auth', authLimiter, authRouter);
app.use('/api/convites', convitesRouter);
app.use('/api/empresas', empresasRouter);
app.use('/api/testes', testesRouter);
app.use('/api/colaboradores', colaboradoresRouter);
app.use('/api/erp', erpRouter);
app.use('/api/teste-disponibilidade', testeDisponibilidadeRouter);
app.use('/api/curso-disponibilidade', cursoDisponibilidadeRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/admin', adminRouter);
app.use('/api/chatbot', chatbotRouter);
app.use('/api/email', emailTestRouter);
app.use('/api/cursos', cursosRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Erro não tratado', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  logger.info(`🚀 Servidor HumaniQ AI iniciado em http://localhost:${PORT}`);
  logger.info(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔐 Segurança: Helmet.js ✅ | Rate Limiting ✅`);
  logger.info(`📝 Logging estruturado: Winston ✅`);
  logger.debug('Endpoints disponíveis:', {
    auth: 'POST /api/auth/login, POST /api/auth/register/admin',
    convites: 'POST /api/convites/empresa, POST /api/convites/colaborador',
    empresas: 'GET /api/empresas/me',
    colaboradores: 'GET /api/colaboradores/me',
    testes: 'GET /api/testes, POST /api/testes/resultado',
    cursos: 'GET /api/cursos/*',
    admin: 'POST /api/email/test-email',
  });
});

export default app;
