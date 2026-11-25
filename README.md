# AI Model Royalty Protocol

A production-grade on-chain system for AI model licensing, inference credits, and automated royalty distribution.

## Why this exists

AI model creators struggle with fair monetization. This protocol lets any developer register an AI model, set a price per inference, and receive royalties automatically every time a user pays — all enforced by a smart contract. No middlemen, no delayed payouts.

## Features

- Register AI models with metadata (IPFS/Arweave)
- Users purchase inference credits with USDC (or any ERC-20)
- Automatic royalty split: creator share + small protocol fee
- On-chain credit tracking
- Reentrancy-protected, Ownable, production-ready

## Tech Stack

- **Smart Contract**: Solidity 0.8.20 + OpenZeppelin (Ownable, ReentrancyGuard, IERC20)
- **Frontend**: Next.js 14, Wagmi, Viem, RainbowKit (wallet connection)
- **Payment**: USDC on Base / Ethereum / Polygon
- **Metadata**: IPFS

## Architecture

```
User → Wallet → Smart Contract (purchaseInferences)
                     ↓
            Automatic royalty transfer to creator
                     ↓
            Credits recorded on-chain
```

## Deployment

1. Deploy with USDC address and fee recipient
2. Creators call `registerModel`
3. Users approve + call `purchaseInferences`
4. Frontend reads credits and allows inference consumption

## Frontend

The `frontend/` app is a Next.js 14 (App Router) + TypeScript + Tailwind CSS dApp using RainbowKit, wagmi and viem.

- Wallet connection on **Base, Ethereum and Polygon**
- Marketplace of four sample AI models with price, creator and description
- **Buy Credits** in two modes:
  - **Demo mode** (default): the wallet signs a free, gasless purchase receipt; credits and the 98/2 royalty split are tracked per wallet and chain in the browser
  - **Live mode**: set a deployed contract address and the app reads `userCredits` on-chain and runs `approve` → `purchaseInferences` for real
- Credit-balance dashboard with a royalty activity feed
- Fully responsive, dark UI

### Run locally

```bash
cd frontend
cp .env.example .env.local   # optional
npm install
npm run dev
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_WC_PROJECT_ID` | Free WalletConnect / Reown project ID (enables QR and mobile wallets; browser-extension wallets work without it) |
| `NEXT_PUBLIC_CONTRACT_BASE` / `_MAINNET` / `_POLYGON` | Deployed contract per chain. Leave blank for demo mode |

### Deploy on Vercel

Import the repo and set **Root Directory** to `frontend`. Framework preset: Next.js.

Built by Excel Shogbola to demonstrate production-level Web3 + AI product engineering.

**GitHub**: https://github.com/Next-ofkin/ai-model-royalty-protocol