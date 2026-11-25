'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { errMsg, useAuth } from '@/lib/auth';

/** Shows "Sign in" once a wallet is connected, and "Signed in" with a sign-out option after. */
export function SignInButton({ className = '', full = false }: { className?: string; full?: boolean }) {
  const { isConnected } = useAccount();
  const { user, dbReady, signingIn, signIn, signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);

  if (!isConnected || !dbReady) return null;

  if (user) {
    return (
      <button
        onClick={signOut}
        title="Signed in with your wallet. Click to sign out."
        className={`group inline-flex items-center gap-2 rounded-xl border border-mint/30 bg-mint/10 px-3 py-2 text-sm font-medium text-mint transition hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-300 ${className}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        <span className="group-hover:hidden">Signed in</span>
        <span className="hidden group-hover:inline">Sign out</span>
      </button>
    );
  }

  return (
    <div className={full ? 'w-full' : ''}>
      <button
        onClick={async () => {
          setError(null);
          try {
            await signIn();
          } catch (e) {
            setError(errMsg(e));
          }
        }}
        disabled={signingIn}
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-ink-950 transition hover:bg-zinc-200 disabled:opacity-60 ${full ? 'w-full' : ''} ${className}`}
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M10 1a4 4 0 0 0-4 4v2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1V5a4 4 0 0 0-4-4Zm2 6H8V5a2 2 0 1 1 4 0v2Z" />
        </svg>
        {signingIn ? 'Check your wallet…' : 'Sign in'}
      </button>
      {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
    </div>
  );
}
