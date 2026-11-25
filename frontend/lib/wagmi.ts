import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base, mainnet, polygon, type AppKitNetwork } from '@reown/appkit/networks';
import { cookieStorage, createStorage } from 'wagmi';

// Public client ID from cloud.reown.com (safe to commit). Override with NEXT_PUBLIC_WC_PROJECT_ID if needed.
export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || '4b58efdf33949ef8ebac9e7d4b979922';

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [base, mainnet, polygon];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
