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

## Live Demo Goals

- Wallet connect (RainbowKit)
- Model marketplace UI
- One-click purchase of inference credits
- Real-time royalty visualization

Built by Excel Shogbola to demonstrate production-level Web3 + AI product engineering.

**GitHub**: https://github.com/Next-ofkin/ai-model-royalty-protocol