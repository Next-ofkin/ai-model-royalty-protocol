import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  binanceWallet,
  bitgetWallet,
  bybitWallet,
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  okxWallet,
  phantomWallet,
  rainbowWallet,
  safepalWallet,
  tokenPocketWallet,
  trustWallet,
  walletConnectWallet,
  zerionWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { base, mainnet, polygon } from 'wagmi/chains';

// Public client ID (safe to commit). Override with NEXT_PUBLIC_WC_PROJECT_ID if needed.
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || '4b58efdf33949ef8ebac9e7d4b979922';

const SITE = 'https://ai-model-royalty-protocol.vercel.app';
const origin = typeof window !== 'undefined' ? window.location.origin : SITE;

const connectors = connectorsForWallets(
  [
    { groupName: 'Popular', wallets: [metaMaskWallet, trustWallet, coinbaseWallet, binanceWallet, okxWallet] },
    {
      groupName: 'More wallets',
      wallets: [bitgetWallet, bybitWallet, phantomWallet, rainbowWallet, safepalWallet, tokenPocketWallet, zerionWallet, ledgerWallet],
    },
    { groupName: 'Other', wallets: [walletConnectWallet, injectedWallet] },
  ],
  {
    appName: 'AI Model Royalty Protocol',
    projectId,
    walletConnectParameters: {
      metadata: {
        name: 'AI Model Royalty Protocol',
        description: 'On-chain licensing and automated royalties for AI models',
        url: origin,
        icons: [`${SITE}/icon.svg`],
        // Lets mobile wallets that support it jump back to the site after you approve.
        redirect: { universal: origin },
      },
    },
  },
);

export const config = createConfig({
  connectors,
  chains: [base, mainnet, polygon],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
  },
  ssr: true,
});
