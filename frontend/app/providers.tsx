'use client';

import { createAppKit } from '@reown/appkit/react';
import { base } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { WagmiProvider, type Config } from 'wagmi';
import { AuthProvider } from '../lib/auth';
import { networks, projectId, wagmiAdapter } from '../lib/wagmi';

const SITE = 'https://ai-model-royalty-protocol.vercel.app';

// One connect window for everyone: crypto wallets, or email / Google for people new to crypto
// (they get a wallet created for them automatically).
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  defaultNetwork: base,
  projectId,
  metadata: {
    name: 'AI Model Royalty Protocol',
    description: 'On-chain licensing and automated royalties for AI models',
    url: typeof window !== 'undefined' ? window.location.origin : SITE,
    icons: [`${SITE}/icon.svg`],
  },
  features: {
    email: true,
    socials: ['google', 'apple', 'x', 'facebook', 'github', 'discord'],
    emailShowWallets: true,
    analytics: false,
    swaps: false,
    onramp: false,
    send: false,
    history: false,
  },
  // Plain accounts for email/social users, so their signatures verify like any normal wallet.
  defaultAccountTypes: { eip155: 'eoa' },
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa', // Coinbase Wallet
    '8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4', // Binance Web3 Wallet
    '971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709', // OKX Wallet
  ],
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#7c5cff',
    '--w3m-color-mix': '#07080c',
    '--w3m-color-mix-strength': 20,
    '--w3m-border-radius-master': '2px',
    '--w3m-font-family': 'Inter Variable, ui-sans-serif, system-ui',
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
