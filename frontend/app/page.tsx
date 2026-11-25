'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useState } from 'react';

const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Replace after deployment

const DEMO_MODELS = [
  {
    id: 1,
    name: 'Legal Document Analyzer',
    creator: '0x742d...35Cc',
    price: '0.50 USDC',
    description: 'Analyzes contracts and extracts key clauses using fine-tuned LLM.',
  },
  {
    id: 2,
    name: 'African Language Translator',
    creator: '0x8a3f...9b21',
    price: '0.25 USDC',
    description: 'High-accuracy translation for Yoruba, Igbo, Hausa and Pidgin.',
  },
  {
    id: 3,
    name: 'Credit Risk Scorer',
    creator: '0x1c9e...4f77',
    price: '1.00 USDC',
    description: 'On-chain credit scoring model for salary lenders and fintechs.',
  },
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const [credits, setCredits] = useState<Record<number, number>>({});

  const handleBuy = (modelId: number) => {
    setCredits((prev) => ({
      ...prev,
      [modelId]: (prev[modelId] || 0) + 10,
    }));
    alert('Demo: 10 inference credits added! (Connect real contract for live transactions)');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">AI Model Royalty Protocol</h1>
            <p className="text-zinc-400 mt-2">Decentralized licensing & automated on-chain royalties for AI models</p>
          </div>
          <ConnectButton />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {DEMO_MODELS.map((model) => (
            <div key={model.id} className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/50 hover:bg-zinc-900 transition">
              <h3 className="text-xl font-semibold">{model.name}</h3>
              <p className="text-sm text-zinc-400 mt-1">by {model.creator}</p>
              <p className="text-zinc-300 mt-3 text-sm">{model.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-medium">{model.price}</span>
                <button
                  onClick={() => handleBuy(model.id)}
                  disabled={!isConnected}
                  className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-200 transition"
                >
                  Buy Credits
                </button>
              </div>
              {isConnected && (
                <p className="text-xs text-zinc-500 mt-3">
                  Your credits: {credits[model.id] || 0}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="border border-zinc-800 rounded-xl p-8 bg-zinc-900/30">
          <h2 className="text-2xl font-semibold mb-4">How it works</h2>
          <ol className="list-decimal list-inside space-y-2 text-zinc-300">
            <li>Creators register an AI model with a price per inference</li>
            <li>Users pay with USDC and receive on-chain credits</li>
            <li>Royalties are automatically sent to the creator in the same transaction</li>
          </ol>
        </div>

        <footer className="mt-16 text-center text-sm text-zinc-500">
          Built by Excel Shogbola · <a href="https://github.com/Next-ofkin/ai-model-royalty-protocol" className="underline">GitHub</a> · <a href="https://portfolio.dastrings.name.ng" className="underline">Portfolio</a>
        </footer>
      </div>
    </div>
  );
}