# AI Model Royalty Protocol

**Live demo:** https://ai-model-royalty-protocol.vercel.app
**Case study:** https://portfolio.dastrings.name.ng/work/ai-model-royalty-protocol

An on-chain marketplace where AI builders sell access to their models and get paid instantly. Users buy inference credits in USDC, and a smart contract splits every payment between the creator (98%) and the protocol (2%) in the same transaction.

> **The live demo is safe to try.** It runs in demo mode: you connect a wallet, get 100 practice USDC and buy credits. Your wallet only *signs* a message, which is free. No real money moves and there are no gas fees.

---

## In plain English

**In one sentence:** it's a shop where people who build AI tools can sell them, and they get paid instantly and automatically, with no one in the middle holding their money.

### A short story

**Tunde** is a programmer in Ibadan. He builds an AI that translates English into Yoruba. Businesses want to use it.

**The old way:** Tunde lists his tool on a big website. A customer pays, the website keeps the money, and Tunde waits weeks for his payout. The website takes a large cut, and Tunde has to trust whatever sales numbers it shows him.

**With this project:**

1. Tunde lists his translator in the shop at **0.25 USDC per translation**. USDC is a digital dollar.
2. **Amaka** runs a small business and needs 50 translations. She buys **50 credits**, the way you buy airtime before making calls.
3. The moment she pays, the money splits itself: **98% goes straight to Tunde's wallet** and **2% goes to the shop** as its fee. Nobody waits for a payout and nobody sits in the middle.
4. Each time Amaka uses the translator, **one credit is used up**, just like airtime going down with each call.

### What makes it automatic?

The rules live in a **smart contract**. Think of it as a vending machine that nobody can tamper with. You put money in, and it always does exactly what it was built to do: it gives Amaka her credits and drops Tunde's share into his wallet. Nobody can quietly change the price, hold back Tunde's money or fake the sales numbers, because anyone can check the machine's records.

A **wallet** (Trust Wallet, MetaMask, Coinbase Wallet and others) is your bank app and ID card in one. It holds your digital money and proves who you are.

### What the website does today

The live site is a **practice version**, like a flight simulator:

- You see four sample AI tools: a legal document reader, a Nigerian-language translator, a loan-risk checker and an image generator.
- You connect a wallet and get **100 practice USDC**. You can top up any time.
- You buy credits and watch the split happen: how much went to the creator and how much to the shop.
- Your wallet only **signs**, which is like writing your signature to say "yes, that's me". Nothing is sent.

The contract that takes real payments is already written. It goes live once it's deployed and its address is added to the site.

---

## Features

**Smart contract** (`contracts/AIModelRoyaltyProtocol.sol`)
- Creators register a model with a metadata link (IPFS or Arweave) and a price per inference
- Users buy inference credits in USDC or any ERC-20 token chosen at deploy time
- Each payment is split instantly: creator share plus a protocol fee (2% by default, hard-capped at 10%)
- Credits are stored on-chain per model and per wallet, and `consumeInference` burns one per use
- Creators can deactivate their own models
- Built on OpenZeppelin `Ownable`, `ReentrancyGuard` and `IERC20`

**Web app** (`frontend/`)
- Wallet connection on **Base, Ethereum and Polygon** (MetaMask, Trust Wallet, Coinbase, Binance, OKX, Bitget, Bybit, Phantom, SafePal and 300+ more through WalletConnect)
- Marketplace of four sample AI models showing creator, price, description and stats
- **Buy Credits** in two modes:
  - **Demo mode** (default): each wallet starts with 100 demo USDC that goes down with every purchase, with a top-up button. Buying asks for a free, gasless signature. Credits, balance and the 98/2 split are saved per wallet and chain in the browser.
  - **Live mode**: set a deployed contract address and the same buttons read `userCredits` on-chain and run `approve` → `purchaseInferences` with real USDC
- Dashboard with credit balances, USDC spent, royalties paid and a royalty activity feed
- "How it works" section, dark responsive design and mobile navigation

## How it works

```
 Buyer's wallet
      │  pays USDC (approve + purchaseInferences)
      ▼
 ┌──────────────────────────────┐
 │  AIModelRoyaltyProtocol.sol  │
 └──────────────────────────────┘
      │                │                 │
      ▼                ▼                 ▼
  Creator 98%     Protocol fee 2%    Credits recorded
  (paid now)      (treasury)         on-chain for buyer
```

1. Deploy the contract with the USDC address and a fee recipient.
2. Creators call `registerModel(metadataURI, pricePerInference, royaltyBps)`.
3. Users approve USDC, then call `purchaseInferences(modelId, numInferences)`.
4. Apps call `consumeInference(modelId)` on each use. Balances are read with `userCredits(modelId, user)`.

## Tech stack

| Layer | Tools |
| --- | --- |
| Smart contract | Solidity 0.8.20, OpenZeppelin |
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Web3 | RainbowKit, wagmi, viem |
| Payments | USDC on Base, Ethereum and Polygon |
| Hosting | Vercel |

## Run locally

```bash
cd frontend
cp .env.example .env.local   # optional
npm install
npm run dev                  # http://localhost:3000
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_WC_PROJECT_ID` | Free WalletConnect / Reown project ID from cloud.reown.com. Enables QR-code and mobile-app connections. Browser-extension wallets and in-wallet browsers work without it. |
| `NEXT_PUBLIC_CONTRACT_BASE` / `NEXT_PUBLIC_CONTRACT_MAINNET` / `NEXT_PUBLIC_CONTRACT_POLYGON` | Deployed contract address per chain. Leave blank to stay in demo mode. |

## Deploy on Vercel

Import the repo, set **Root Directory** to `frontend` and keep the Next.js preset. Every push to `main` redeploys automatically.

## Status

- ✅ Web app live in demo mode
- ✅ Smart contract written
- ⏳ Next: contract tests, a testnet deployment (Base Sepolia) and a security review before handling real funds

---

Built by **Excel Shogbola** · [Portfolio](https://portfolio.dastrings.name.ng) · [GitHub](https://github.com/Next-ofkin)
