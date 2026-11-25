import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, mainnet, polygon } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'AI Model Royalty Protocol',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Replace with your own from cloud.walletconnect.com
  chains: [base, mainnet, polygon],
  ssr: true,
});