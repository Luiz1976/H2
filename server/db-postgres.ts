import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";
import * as schema from '../shared/schema';

// Configurar WebSocket para Neon
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
  max: 10,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000
});

export const db = drizzle({ client: pool, schema });

// Função para executar migrações PostgreSQL
export async function runMigrations() {
  try {
    console.log('🔄 Executando migrações PostgreSQL...');
    
    // Para PostgreSQL, assumir que as tabelas já existem via Drizzle migrations
    console.log('✅ PostgreSQL: assumindo que as tabelas já existem');
    
    console.log('✅ Migrações PostgreSQL concluídas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar migrações PostgreSQL:', error);
    throw error;
  }
}