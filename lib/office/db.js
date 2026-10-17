// Postgres for the back office. Online this is Neon (connected through
// Vercel, which sets DATABASE_URL); on a laptop it can be any local Postgres.
// One small connection pool per server instance.
import pg from "pg";

const url = () => process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
let pool;

export const hasDatabase = () => !!url();

function getPool() {
  if (!hasDatabase()) {
    const e = new Error("The database isn't connected yet.");
    e.code = "NO_DATABASE";
    throw e;
  }
  // Neon's address asks for sslmode=require, which this driver already treats
  // as "check the certificate" (verify-full). Saying so plainly keeps the
  // same behaviour without a warning in the logs.
  const connectionString = url().replace(/([?&]sslmode=)(?:require|prefer|verify-ca)\b/, "$1verify-full");
  if (!pool) pool = new pg.Pool({ connectionString, max: 3, idleTimeoutMillis: 10_000 });
  return pool;
}

// Every query uses $1, $2... placeholders, never pasted-in values.
export async function q(text, params = []) {
  const res = await getPool().query(text, params);
  return res.rows;
}

export async function q1(text, params = []) {
  const rows = await q(text, params);
  return rows[0] ?? null;
}

// Run several statements in one transaction: all of them or none.
export async function tx(fn) {
  const client = await getPool().connect();
  try {
    await client.query("begin");
    const out = await fn((text, params = []) => client.query(text, params).then(r => r.rows));
    await client.query("commit");
    return out;
  } catch (e) {
    await client.query("rollback").catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}
