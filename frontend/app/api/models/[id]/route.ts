import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/server/db';
import { fail } from '@/lib/server/http';
import { getSession } from '@/lib/server/session';

export const dynamic = 'force-dynamic';

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const address = getSession();
    if (!address) return NextResponse.json({ error: 'Sign in with your wallet first.' }, { status: 401 });
    const id = Number(params.id);
    if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: 'Invalid model.' }, { status: 400 });
    const pool = await db();
    const res = await pool.query('DELETE FROM amrp_models WHERE id = $1 AND creator = $2', [id, address]);
    if (res.rowCount !== 1) return NextResponse.json({ error: 'Model not found, or it is not yours.' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
