'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { createSiweMessage } from 'viem/siwe';
import { base } from 'wagmi/chains';

type AuthState = {
  /** Wallet address of the signed-in session, if it matches the connected wallet */
  user: `0x${string}` | null;
  /** False until a database is connected on the server */
  dbReady: boolean;
  loading: boolean;
  signingIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [session, setSession] = useState<`0x${string}` | null>(null);
  const [dbReady, setDbReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: { address: `0x${string}` | null; db: boolean }) => {
        setSession(d.address);
        setDbReady(d.db);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const signIn = useCallback(async () => {
    if (!address) throw new Error('Connect a wallet first.');
    setSigningIn(true);
    try {
      const n = await fetch('/api/auth/nonce', { cache: 'no-store' });
      const nd = await n.json();
      if (!n.ok) throw new Error(nd.error || 'Could not start sign-in.');
      const message = createSiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in to AI Model Royalty Protocol. This is free and does not send a transaction.',
        uri: window.location.origin,
        version: '1',
        chainId: chainId ?? base.id,
        nonce: nd.nonce,
        issuedAt: new Date(),
      });
      const signature = await signMessageAsync({ message });
      const v = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message, signature }),
      });
      const vd = await v.json();
      if (!v.ok) throw new Error(vd.error || 'Sign-in failed.');
      setSession(vd.address);
    } finally {
      setSigningIn(false);
    }
  }, [address, chainId, signMessageAsync]);

  const signOut = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    setSession(null);
  }, []);

  const user = session && address && session.toLowerCase() === address.toLowerCase() ? session : null;

  return <Ctx.Provider value={{ user, dbReady, loading, signingIn, signIn, signOut }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside AuthProvider');
  return v;
}

export function errMsg(e: unknown) {
  const m = (e as { shortMessage?: string; message?: string })?.shortMessage || (e as Error)?.message || 'Something went wrong.';
  return /reject|denied|cancel/i.test(m) ? 'Request cancelled in wallet.' : m;
}
