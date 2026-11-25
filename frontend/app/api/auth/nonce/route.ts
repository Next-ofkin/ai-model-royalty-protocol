import { NextResponse } from 'next/server';
import { generateSiweNonce } from 'viem/siwe';
import { db } from '@/lib/server/db';
import { fail } from '@/lib/server/http';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pool = await db();
    const nonce = generateSiweNonce();
    await pool.query("DELETE FROM amrp_nonces WHERE created_at < now() - interval '15 minutes'");
    await pool.query('INSERT INTO amrp_nonces (nonce) VALUES ($1)', [nonce]);
    return NextResponse.json({ nonce });
  } catch (e) {
    return fail(e);
  }
}
