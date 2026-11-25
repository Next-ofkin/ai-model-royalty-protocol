import { NextResponse, type NextRequest } from 'next/server';
import { createPublicClient, http, type Hex } from 'viem';
import { base, mainnet, polygon } from 'viem/chains';
import { parseSiweMessage } from 'viem/siwe';
import { db } from '@/lib/server/db';
import { fail } from '@/lib/server/http';
import { setSession } from '@/lib/server/session';

export const dynamic = 'force-dynamic';

const CHAINS = { [base.id]: base, [mainnet.id]: mainnet, [polygon.id]: polygon } as const;

export async function POST(req: NextRequest) {
  try {
    const { message, signature } = (await req.json()) as { message?: string; signature?: Hex };
    if (typeof message !== 'string' || typeof signature !== 'string' || message.length > 2000) {
      return NextResponse.json({ error: 'Invalid sign-in request.' }, { status: 400 });
    }
    const fields = parseSiweMessage(message);
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
    if (!fields.address || !fields.nonce || fields.domain !== host) {
      return NextResponse.json({ error: 'This sign-in message is not for this site.' }, { status: 400 });
    }

    const pool = await db();
    // One-time nonce: delete it as we check it, so a signature can't be replayed.
    const used = await pool.query(
      "DELETE FROM amrp_nonces WHERE nonce = $1 AND created_at > now() - interval '15 minutes' RETURNING nonce",
      [fields.nonce],
    );
    if (used.rowCount !== 1) {
      return NextResponse.json({ error: 'Sign-in expired. Please try again.' }, { status: 400 });
    }

    const chain = CHAINS[(fields.chainId ?? base.id) as keyof typeof CHAINS] ?? base;
    const client = createPublicClient({ chain, transport: http() });
    // Handles normal wallets and smart-contract wallets (ERC-1271 / ERC-6492).
    const ok = await client.verifySiweMessage({ message, signature, domain: host, nonce: fields.nonce });
    if (!ok) return NextResponse.json({ error: 'Signature did not match this wallet.' }, { status: 401 });

    setSession(fields.address);
    return NextResponse.json({ address: fields.address });
  } catch (e) {
    return fail(e);
  }
}
