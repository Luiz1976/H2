import { drizzle } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import Database from 'better-sqlite3';
import ws from "ws";
import * as schema from '../shared/schema';

// Configurar WebSocket para Neon
neonConfig.webSocketConstructor = ws;

// Escolher banco baseado no ambiente
const isProduction = process.env.NODE_ENV === 'production';
const hasDatabaseUrl = !!process.env.DATABASE_URL;

let db: any;
let dbType: string;

if (isProduction && hasDatabaseUrl) {
  // Usar PostgreSQL (Neon) em produção
  console.log('🔗 Conectando ao PostgreSQL (Neon)...');
  
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    max: 10,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000
  });
  
  db = drizzleNeon({ client: pool, schema });
  dbType = 'PostgreSQL (Neon)';
} else {
  // Usar SQLite em desenvolvimento
  console.log('🔗 Conectando ao SQLite (desenvolvimento)...');
  
  const sqlite = new Database('humaniq-dev.db');
  sqlite.pragma('journal_mode = WAL');
  
  db = drizzle(sqlite, { schema });
  dbType = 'SQLite (desenvolvimento)';
}

// Função para executar migrações
export async function runMigrations() {
  try {
    console.log(`🔄 Executando migrações ${dbType}...`);
    
    if (dbType.includes('SQLite')) {
      // Executar migrações SQLite
      const { runMigrations: runSQLiteMigrations } = await import('./db-sqlite');
      await runSQLiteMigrations();
    } else {
      // Para PostgreSQL, assumir que as tabelas já existem
      console.log('✅ PostgreSQL: assumindo que as tabelas já existem');
    }
    
    console.log(`✅ Migrações ${dbType} concluídas com sucesso!`);
  } catch (error) {
    console.error(`❌ Erro ao executar migrações ${dbType}:`, error);
    throw error;
  }
}

export { db, dbType };