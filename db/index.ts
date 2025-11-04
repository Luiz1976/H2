import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';

if (!process.env.DATABASE_URL) {
  console.warn('⚠️  DATABASE_URL not set. Database operations will fail.');
  // Para desenvolvimento, criar um mock ou usar uma URL padrão
  process.env.DATABASE_URL = 'postgresql://localhost:5432/mock_db';
}

export const client = postgres(process.env.DATABASE_URL, {
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
