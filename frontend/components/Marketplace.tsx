'use client';

import { useOpenConnect } from './ConnectButton';
import { useState } from 'react';
import Link from 'next/link';
import { PROTOCOL_FEE_BPS, fmtUsd, shortAddr, type AIModel } from '@/lib/models';
import type { BuyStage, useProtocol } from '@/lib/useProtocol';

type P = ReturnType<typeof useProtocol>;
const QTYS = [10, 50, 100];

const STAGE_LABEL: Record<BuyStage, string> = {
  idle: 'Buy credits',
  signing: 'Confirm in wallet…',
  approving: 'Approving USDC…',
  purchasing: 'Confirm purchase…',
  confirming: 'Settling on-chain…',
};

function ModelCard({ model, p, onResult }: { model: AIModel; p: P; onResult: (ok: boolean, msg: string) => void }) {
  const [qty, setQty] = useState(10);
  const openConnect = useOpenConnect();
  const busy = p.stage?.modelId === model.id;
  const anyBusy = !!p.stage;
  const total = model.price * qty;
  const fee = (total * PROTOCOL_FEE_BPS) / 10_000;
  const owned = p.credits[model.id] || 0;
  const short = p.isConnected && p.mode === 'demo' && total > p.usdc + 1e-9;

  async function handleBuy() {
    if (!p.isConnected) return openConnect();
    try {
      await p.buy(model.id, qty);
      onResult(true, `${qty} credits added for ${model.name}. ${fmtUsd(total - fee)} USDC routed to ${model.creatorName}.`);
    } catch (e) {
      const msg = (e as { shortMessage?: string; message?: string })?.shortMessage || (e as Error)?.message || 'Failed';
      onResult(false, /reject|denied/i.test(msg) ? 'Request cancelled in wallet.' : msg);
    }
  }

  return (
    <article className="glass group relative flex flex-col p-6 transition duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-4">
        <div
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${model.gradient} text-xl font-semibold text-white shadow-lg`}
          aria-hidden
        >
          {model.glyph}
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          {model.community && (
            <span className="rounded-full bg-mint/10 px-2.5 py-1 text-[11px] font-medium text-mint">Community</span>
          )}
          <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-medium text-zinc-400">{model.category}</span>
        </div>
      </div>

      <h3 className="mt-5 text-lg font-semibold tracking-tight">{model.name}</h3>
      <p className="text-sm text-zinc-500">
        by <span className="text-zinc-300">{model.creatorName}</span>{' '}
        <span className="font-mono text-xs text-zinc-600">{shortAddr(model.creator)}</span>
      </p>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{model.description}</p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {model.tags.map((t) => (
          <li key={t} className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[11px] text-zinc-400">
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-4 text-center">
        <div>
          <div className="font-mono text-sm text-zinc-100">${fmtUsd(model.price)}</div>
          <div className="text-[11px] text-zinc-500">per call</div>
        </div>
        {model.community ? (
          <>
            <div>
              <div className="font-mono text-sm text-mint">New</div>
              <div className="text-[11px] text-zinc-500">listing</div>
            </div>
            <div>
              <div className="font-mono text-sm text-zinc-100">98%</div>
              <div className="text-[11px] text-zinc-500">to creator</div>
            </div>
          </>
        ) : (
          <>
            <div>
              <div className="font-mono text-sm text-zinc-100">{(model.inferences / 1000).toFixed(1)}k</div>
              <div className="text-[11px] text-zinc-500">inferences</div>
            </div>
            <div>
              <div className="font-mono text-sm text-zinc-100">
                {model.latencyMs < 1000 ? `${model.latencyMs}ms` : `${(model.latencyMs / 1000).toFixed(1)}s`}
              </div>
              <div className="text-[11px] text-zinc-500">p50 latency</div>
            </div>
          </>
        )}
      </div>

      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between gap-2">
          <div role="radiogroup" aria-label="Credit quantity" className="flex rounded-lg border border-white/10 p-0.5">
            {QTYS.map((q) => (
              <button
                key={q}
                role="radio"
                aria-checked={qty === q}
                onClick={() => setQty(q)}
                className={`rounded-md px-2.5 py-1 font-mono text-xs transition ${
                  qty === q ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
          <div className="whitespace-nowrap font-mono text-sm font-medium">{fmtUsd(total)} USDC</div>
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-zinc-500">
          <span>
            <span className="text-mint">{fmtUsd(total - fee)}</span> to creator
          </span>
          <span>
            <span className="text-accent-soft">{fmtUsd(fee)}</span> protocol fee
          </span>
        </div>
        <button onClick={short ? p.faucet : handleBuy} disabled={anyBusy && !busy} className="btn-primary mt-4 w-full" aria-busy={busy}>
          {busy && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          )}
          {!p.isConnected
            ? 'Connect wallet to buy'
            : busy
              ? STAGE_LABEL[p.stage!.stage]
              : short
                ? 'Top up demo USDC'
                : STAGE_LABEL.idle}
        </button>
        {busy && (
          <p className="mt-2.5 rounded-lg bg-accent/10 px-3 py-2 text-center text-xs text-accent-soft">
            Approve in your wallet. On a phone, switch back to this page after signing.
          </p>
        )}
        {p.isConnected && !busy && (
          <p className="mt-2.5 text-center text-xs text-zinc-500">
            Your balance: <span className="font-mono text-zinc-200">{owned}</span> credits
          </p>
        )}
      </div>
    </article>
  );
}

export function Marketplace({ p }: { p: P }) {
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);
  function onResult(ok: boolean, msg: string) {
    setToast({ ok, msg });
    window.setTimeout(() => setToast(null), 5000);
  }

  return (
    <section id="models" className="container-x scroll-mt-20 py-20">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-accent-soft">Marketplace</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Featured models</h2>
          <p className="mt-3 max-w-xl text-zinc-400">
            Pick a model, choose how many inference credits you need, and pay once. The creator is paid in the same
            transaction.
          </p>
        </div>
        <div className="eyebrow self-start sm:self-auto">
          {p.mode === 'live' ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-mint" /> Live contract · USDC
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Demo mode · free signature, no gas
              {p.isConnected && (
                <span className="ml-1 border-l border-white/10 pl-2 font-mono text-zinc-200">{fmtUsd(p.usdc)} USDC</span>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {p.models
          .filter((m) => !m.community)
          .map((m) => (
            <ModelCard key={m.id} model={m} p={p} onResult={onResult} />
          ))}
      </div>

      <div className="mt-16 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">Community models</h3>
          <p className="mt-2 max-w-xl text-sm text-zinc-400">
            Listed by builders who signed in with their wallet. Anyone can list a model in about a minute.
          </p>
        </div>
        <Link href="/list" className="btn-ghost self-start sm:self-auto">
          + List your model
        </Link>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {p.models
          .filter((m) => m.community)
          .map((m) => (
            <ModelCard key={m.id} model={m} p={p} onResult={onResult} />
          ))}
        <Link
          href="/list"
          className="group flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 p-6 text-center transition hover:border-accent/60 hover:bg-accent/5"
        >
          <span className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 text-2xl text-zinc-400 transition group-hover:text-white">+</span>
          <span className="mt-4 font-medium">List your AI model</span>
          <span className="mt-1 max-w-[220px] text-sm text-zinc-500">Sign in with your wallet, set a price and start earning 98% of every sale.</span>
        </Link>
      </div>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
        {toast && (
          <div
            className={`pointer-events-auto flex max-w-md animate-fade-up items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-xl ${
              toast.ok ? 'border-mint/30 bg-ink-900/90 text-zinc-100' : 'border-rose-500/30 bg-ink-900/90 text-rose-200'
            }`}
          >
            <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${toast.ok ? 'bg-mint' : 'bg-rose-400'}`} />
            {toast.msg}
          </div>
        )}
      </div>
    </section>
  );
}
