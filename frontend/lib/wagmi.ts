import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { http } from 'wagmi';
import { base, mainnet, polygon } from 'wagmi/chains';

// A WalletConnect (Reown) project ID enables QR-code / mobile wallets (Trust Wallet app, Rainbow, etc.).
// Browser-extension wallets and in-wallet dApp browsers work without it.
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || '00000000000000000000000000000000';

export const config = getDefaultConfig({
  appName: 'AI Model Royalty Protocol',
  appDescription: 'On-chain licensing and automated royalties for AI models',
  appUrl: 'https://ai-model-royalty-protocol.vercel.app',
  projectId,
  wallets: [
    { groupName: 'Popular', wallets: [metaMaskWallet, trustWallet, coinbaseWallet, rainbowWallet] },
    { groupName: 'More', wallets: [walletConnectWallet, injectedWallet] },
  ],
  chains: [base, mainnet, polygon],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
  },
  ssr: true,
});
