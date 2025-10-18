import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import convitesRouter from './routes/convites';
import empresasRouter from './routes/empresas';
import testesRouter from './routes/testes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  console.log(`   GET  /api/testes`);
  console.log(`   POST /api/testes/resultado`);
});

export default app;
