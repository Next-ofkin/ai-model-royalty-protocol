'use client';

import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { CHAIN_META } from '@/lib/contract';
import { shortAddr } from '@/lib/models';

/** Connect / account button that opens the Reown window (wallets, email and Google). */
export function ConnectButton({ size = 'md', label = 'Connect' }: { size?: 'md' | 'lg'; label?: string }) {
  const { open } = useAppKit();
  const { address, isConnected, chainId } = useAccount();
  const { embeddedWalletInfo } = useAppKitAccount();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const pad = size === 'lg' ? 'px-5 py-2.5' : 'px-4 py-2';

  if (!mounted || !isConnected || !address) {
    return (
      <button
        onClick={() => open({ view: 'Connect' })}
        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-accent ${pad} text-sm font-semibold text-white shadow-glow transition hover:bg-accent/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft`}
      >
        {label}
      </button>
    );
  }

  const chain = chainId ? CHAIN_META[chainId] : undefined;
  const email = embeddedWalletInfo?.user?.email;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => open({ view: 'Networks' })}
        title="Switch network"
        className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.08]"
      >
        <span className="h-2 w-2 rounded-full" style={{ background: chain?.color ?? '#f43f5e' }} />
        <span className="hidden sm:inline">{chain?.name ?? 'Wrong network'}</span>
      </button>
      <button
        onClick={() => open({ view: 'Account' })}
        className="inline-flex max-w-[180px] items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-zinc-100 transition hover:bg-white/[0.08]"
      >
        <span className="h-5 w-5 shrink-0 rounded-full bg-gradient-to-br from-accent to-mint" />
        <span className="truncate">{email ?? shortAddr(address)}</span>
      </button>
    </div>
  );
}

/** Opens the connect window from anywhere (e.g. a Buy button when signed out). */
export function useOpenConnect() {
  const { open } = useAppKit();
  return () => open({ view: 'Connect' });
}
