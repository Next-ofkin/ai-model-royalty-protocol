'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const CONTRACT_ADDRESS = '0xYOUR_DEPLOYED_CONTRACT_ADDRESS'; // Update after deployment

export default function Home() {
  const { address, isConnected } = useAccount();

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: 800, margin: '0 auto' }}>
      <h1>AI Model Royalty Protocol</h1>
      <p>Decentralized AI model licensing with automated on-chain royalties.</p>

      <div style={{ margin: '2rem 0' }}>
        <ConnectButton />
      </div>

      {isConnected ? (
        <div>
          <p>Connected: {address}</p>
          <h2>Marketplace</h2>
          <p>Contract address: {CONTRACT_ADDRESS}</p>
          <p>Once deployed, this UI will show registered models, allow purchasing inference credits, and display your on-chain credits.</p>
        </div>
      ) : (
        <p>Connect your wallet to view and interact with AI models.</p>
      )}
    </div>
  );
}