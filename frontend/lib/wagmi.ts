import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { base, mainnet, polygon } from 'wagmi/chains';

// A WalletConnect (Reown) project ID enables QR-code / mobile wallets.
// Browser-extension wallets (MetaMask, Coinbase, Rabby…) work without it.
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || '00000000000000000000000000000000';

export const config = getDefaultConfig({
  appName: 'AI Model Royalty Protocol',
  appDescription: 'On-chain licensing and automated royalties for AI models',
  appUrl: 'https://github.com/Next-ofkin/ai-model-royalty-protocol',
  projectId,
  chains: [base, mainnet, polygon],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
  },
  ssr: true,
});
