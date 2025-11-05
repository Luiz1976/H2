import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
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

  db = drizzle(pool, { schema });
} else {
  // SQLite para desenvolvimento
  const Database = require('better-sqlite3');
  const { drizzle: drizzleSqlite } = require('drizzle-orm/better-sqlite3');
  const sqlite = new Database('humaniq-dev.db');
  sqlite.pragma('journal_mode = WAL');

  db = drizzleSqlite(sqlite, { schema });
}

export { db };