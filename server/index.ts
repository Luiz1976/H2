import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import convitesRouter from './routes/convites';
import empresasRouter from './routes/empresas';
import testesRouter from './routes/testes';
import colaboradoresRouter from './routes/colaboradores';
import erpRouter from './routes/erp';
import testeDisponibilidadeRouter from './routes/teste-disponibilidade';
import stripeRouter from './routes/stripe';
import adminRouter from './routes/admin';
import chatbotRouter from './routes/chatbot';
import emailTestRouter from './routes/email-test';
import cursosRouter from './routes/cursos';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: 'connected'
  });
});

app.use('/api/auth', authRouter);
app.use('/api/convites', convitesRouter);
app.use('/api/empresas', empresasRouter);
app.use('/api/testes', testesRouter);
app.use('/api/colaboradores', colaboradoresRouter);
app.use('/api/erp', erpRouter);
app.use('/api/teste-disponibilidade', testeDisponibilidadeRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/admin', adminRouter);
app.use('/api/chatbot', chatbotRouter);
app.use('/api/email', emailTestRouter);
app.use('/api/cursos', cursosRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Endpoints disponíveis:`);
  console.log(`   POST /api/auth/login`);
  console.log(`   POST /api/auth/register/admin`);
  console.log(`   POST /api/convites/empresa`);
  console.log(`   POST /api/convites/colaborador`);
  console.log(`   GET  /api/convites/token/:token`);
  console.log(`   GET  /api/empresas/me`);
  console.log(`   GET  /api/colaboradores/me`);
  console.log(`   GET  /api/testes`);
  console.log(`   POST /api/testes/resultado`);
  console.log(`   POST /api/email/test-email (ADMIN)`);
  console.log(`   GET  /api/email/email-status (ADMIN)`);
});

export default app;
