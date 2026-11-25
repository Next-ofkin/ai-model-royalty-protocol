import { NextResponse } from 'next/server';
import { dbConfigured } from '@/lib/server/db';
import { getSession } from '@/lib/server/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!dbConfigured) return NextResponse.json({ address: null, db: false });
  return NextResponse.json({ address: getSession(), db: true });
}
