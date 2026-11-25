import 'server-only';
import { NextResponse } from 'next/server';
import { DbNotConfigured } from './db';

export function fail(err: unknown) {
  if (err instanceof DbNotConfigured) {
    return NextResponse.json({ error: 'Database not connected yet.', code: 'NO_DB' }, { status: 503 });
  }
  console.error(err);
  return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
}
