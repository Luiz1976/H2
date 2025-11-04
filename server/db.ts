import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import Database from 'better-sqlite3';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import ws from "ws";
import * as schema from '../shared/schema';

// Configurar WebSocket para Neon
neonConfig.webSocketConstructor = ws;

// Configuração do banco baseada no ambiente
let db: any;

if (process.env.NODE_ENV === 'production') {
  // PostgreSQL (Neon) para produção
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }

  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    max: 10,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000
  });

  db = drizzle({ client: pool, schema });
} else {
  // SQLite para desenvolvimento
  const sqlite = new Database('humaniq-dev.db');
  sqlite.pragma('journal_mode = WAL');
  
  db = drizzleSqlite({ client: sqlite, schema });
}

export { db };