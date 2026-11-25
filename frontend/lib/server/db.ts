import 'server-only';
import { Pool } from 'pg';

// Neon (via the Vercel integration) exposes DATABASE_URL; POSTGRES_URL is the older name.
const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;

declare global {
  // eslint-disable-next-line no-var
  var __amrpPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __amrpSchema: Promise<void> | undefined;
}

export const dbConfigured = Boolean(url);

function pool(): Pool {
  if (!url) throw new DbNotConfigured();
  if (!globalThis.__amrpPool) {
    const local = /localhost|127\.0\.0\.1/.test(url);
    globalThis.__amrpPool = new Pool({
      connectionString: url,
      ssl: local ? undefined : { rejectUnauthorized: true },
      max: 3,
      idleTimeoutMillis: 10_000,
    });
  }
  return globalThis.__amrpPool;
}

export class DbNotConfigured extends Error {
  constructor() {
    super('Database not connected');
  }
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS amrp_nonces (
  nonce TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS amrp_models (
  id SERIAL PRIMARY KEY,
  creator TEXT NOT NULL,
  creator_name TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price_usdc NUMERIC(12, 6) NOT NULL,
  endpoint_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS amrp_models_creator_idx ON amrp_models (creator);
`;

export async function db() {
  const p = pool();
  if (!globalThis.__amrpSchema) {
    globalThis.__amrpSchema = p.query(SCHEMA).then(() => undefined);
    globalThis.__amrpSchema.catch(() => {
      globalThis.__amrpSchema = undefined;
    });
  }
  await globalThis.__amrpSchema;
  return p;
}
