import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { getAddress, type Address } from 'viem';

const COOKIE = 'amrp_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  const s = process.env.SESSION_SECRET || process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!s) throw new Error('No session secret available');
  return createHash('sha256').update(`amrp-session:${s}`).digest();
}

function sign(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

export function setSession(address: Address) {
  const payload = Buffer.from(JSON.stringify({ a: getAddress(address), e: Date.now() + MAX_AGE * 1000 })).toString('base64url');
  cookies().set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export function clearSession() {
  cookies().delete(COOKIE);
}

export function getSession(): Address | null {
  const raw = cookies().get(COOKIE)?.value;
  if (!raw) return null;
  const [payload, sig] = raw.split('.');
  if (!payload || !sig) return null;
  try {
    const expected = Buffer.from(sign(payload));
    const given = Buffer.from(sig);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
    const { a, e } = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { a: string; e: number };
    if (Date.now() > e) return null;
    return getAddress(a);
  } catch {
    return null;
  }
}
