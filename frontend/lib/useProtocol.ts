'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, usePublicClient, useReadContracts, useSignMessage, useWriteContract } from 'wagmi';
import type { Hash } from 'viem';
import { CONTRACTS, erc20Abi, royaltyAbi } from './contract';
import { MODELS, PROTOCOL_FEE_BPS } from './models';

export type Purchase = {
  id: string;
  modelId: number;
  qty: number;
  total: number;
  creatorShare: number;
  protocolFee: number;
  chainId: number;
  at: number;
  mode: 'demo' | 'live';
  ref: string; // signature (demo) or tx hash (live)
};

type Store = { credits: Record<number, number>; history: Purchase[] };
const empty: Store = { credits: {}, history: [] };
const key = (addr: string, chainId: number) => `amrp:v1:${chainId}:${addr.toLowerCase()}`;

function load(addr?: string, chainId?: number): Store {
  if (!addr || !chainId || typeof window === 'undefined') return empty;
  try {
    const raw = window.localStorage.getItem(key(addr, chainId));
    return raw ? (JSON.parse(raw) as Store) : empty;
  } catch {
    return empty;
  }
}
function save(addr: string, chainId: number, s: Store) {
  try {
    window.localStorage.setItem(key(addr, chainId), JSON.stringify(s));
  } catch {
    /* storage unavailable – keep in memory */
  }
}

export type BuyStage = 'idle' | 'signing' | 'approving' | 'purchasing' | 'confirming';

export function useProtocol() {
  const { address, chainId, isConnected } = useAccount();
  const contract = chainId ? CONTRACTS[chainId] : undefined;
  const mode: 'demo' | 'live' = contract ? 'live' : 'demo';
  const publicClient = usePublicClient();
  const { signMessageAsync } = useSignMessage();
  const { writeContractAsync } = useWriteContract();

  const [store, setStore] = useState<Store>(empty);
  const [stage, setStage] = useState<{ modelId: number; stage: BuyStage } | null>(null);

  useEffect(() => {
    setStore(load(address, chainId));
  }, [address, chainId]);

  // Live on-chain balances
  const live = useReadContracts({
    contracts: MODELS.map((m) => ({
      address: contract!,
      abi: royaltyAbi,
      functionName: 'userCredits' as const,
      args: [BigInt(m.id), address!] as const,
    })),
    query: { enabled: mode === 'live' && !!address },
  });

  const credits = useMemo<Record<number, number>>(() => {
    if (mode === 'live' && live.data) {
      return Object.fromEntries(
        MODELS.map((m, i) => [m.id, live.data?.[i]?.status === 'success' ? Number(live.data[i].result) : 0]),
      );
    }
    return store.credits;
  }, [mode, live.data, store.credits]);

  const record = useCallback(
    (p: Purchase, addCredits: boolean) => {
      if (!address || !chainId) return;
      setStore((prev) => {
        const next: Store = {
          credits: addCredits ? { ...prev.credits, [p.modelId]: (prev.credits[p.modelId] || 0) + p.qty } : prev.credits,
          history: [p, ...prev.history].slice(0, 25),
        };
        save(address, chainId, next);
        return next;
      });
    },
    [address, chainId],
  );

  const buy = useCallback(
    async (modelId: number, qty: number): Promise<Purchase> => {
      const model = MODELS.find((m) => m.id === modelId);
      if (!model || !address || !chainId) throw new Error('Connect a wallet first');
      const total = +(model.price * qty).toFixed(6);
      const protocolFee = +((total * PROTOCOL_FEE_BPS) / 10_000).toFixed(6);
      const base = {
        id: crypto.randomUUID(),
        modelId,
        qty,
        total,
        protocolFee,
        creatorShare: +(total - protocolFee).toFixed(6),
        chainId,
        at: Date.now(),
      };

      try {
        if (mode === 'demo') {
          setStage({ modelId, stage: 'signing' });
          const message = [
            'AI Model Royalty Protocol — demo purchase',
            '',
            `Model: #${model.id} ${model.name}`,
            `Credits: ${qty}`,
            `Total: ${total} USDC`,
            `Creator royalty: ${base.creatorShare} USDC → ${model.creator}`,
            `Protocol fee: ${protocolFee} USDC`,
            '',
            'Signing is free and does not send a transaction.',
            `Nonce: ${base.id}`,
          ].join('\n');
          const sig = await signMessageAsync({ message });
          const p: Purchase = { ...base, mode: 'demo', ref: sig };
          record(p, true);
          return p;
        }

        // ---- Live on-chain purchase ----
        if (!publicClient || !contract) throw new Error('No RPC client');
        const [token, onchain] = await Promise.all([
          publicClient.readContract({ address: contract, abi: royaltyAbi, functionName: 'paymentToken' }),
          publicClient.readContract({ address: contract, abi: royaltyAbi, functionName: 'models', args: [BigInt(modelId)] }),
        ]);
        const cost = onchain[2] * BigInt(qty);
        const allowance = await publicClient.readContract({
          address: token,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [address, contract],
        });
        if (allowance < cost) {
          setStage({ modelId, stage: 'approving' });
          const h = await writeContractAsync({ address: token, abi: erc20Abi, functionName: 'approve', args: [contract, cost] });
          await publicClient.waitForTransactionReceipt({ hash: h });
        }
        setStage({ modelId, stage: 'purchasing' });
        const hash: Hash = await writeContractAsync({
          address: contract,
          abi: royaltyAbi,
          functionName: 'purchaseInferences',
          args: [BigInt(modelId), BigInt(qty)],
        });
        setStage({ modelId, stage: 'confirming' });
        await publicClient.waitForTransactionReceipt({ hash });
        await live.refetch();
        const p: Purchase = { ...base, mode: 'live', ref: hash };
        record(p, false);
        return p;
      } finally {
        setStage(null);
      }
    },
    [address, chainId, mode, contract, publicClient, signMessageAsync, writeContractAsync, record, live],
  );

  const reset = useCallback(() => {
    if (!address || !chainId) return;
    setStore(empty);
    save(address, chainId, empty);
  }, [address, chainId]);

  const totalCredits = Object.values(credits).reduce((a, b) => a + b, 0);
  const totalSpent = store.history.reduce((a, p) => a + p.total, 0);

  return { isConnected, address, chainId, mode, credits, totalCredits, totalSpent, history: store.history, buy, stage, reset };
}
