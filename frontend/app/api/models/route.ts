import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/server/db';
import { fail } from '@/lib/server/http';
import { getSession } from '@/lib/server/session';
import { MAX_MODELS_PER_CREATOR, validateListing } from '@/lib/listing';
import { toModel, type Row } from '@/lib/server/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pool = await db();
    const { rows } = await pool.query<Row>('SELECT * FROM amrp_models ORDER BY created_at DESC LIMIT 60');
    return NextResponse.json({ models: rows.map(toModel) });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const address = getSession();
    if (!address) return NextResponse.json({ error: 'Sign in with your wallet first.' }, { status: 401 });
    const parsed = validateListing(await req.json().catch(() => null));
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const v = parsed.value;

    const pool = await db();
    const count = await pool.query<{ n: string }>('SELECT count(*)::text AS n FROM amrp_models WHERE creator = $1', [address]);
    if (Number(count.rows[0].n) >= MAX_MODELS_PER_CREATOR) {
      return NextResponse.json({ error: `You can list up to ${MAX_MODELS_PER_CREATOR} models.` }, { status: 400 });
    }
    const { rows } = await pool.query<Row>(
      `INSERT INTO amrp_models (creator, creator_name, name, description, category, price_usdc, endpoint_url, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [address, v.creatorName, v.name, v.description, v.category, v.price, v.endpointUrl ?? null, v.tags],
    );
    return NextResponse.json({ model: toModel(rows[0]) }, { status: 201 });
  } catch (e) {
    return fail(e);
  }
}
