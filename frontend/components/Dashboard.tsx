'use client';

import { ConnectButton } from './ConnectButton';
import { CHAIN_META } from '@/lib/contract';
import { fmtUsd, shortAddr } from '@/lib/models';
import type { useProtocol } from '@/lib/useProtocol';

type P = ReturnType<typeof useProtocol>;

function timeAgo(t: number) {
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(t).toLocaleDateString();
}

export function Dashboard({ p }: { p: P }) {
  const chain = p.chainId ? CHAIN_META[p.chainId] : undefined;
  const owned = p.models.filter((m) => !m.community || (p.credits[m.id] || 0) > 0);
  const maxCredits = Math.max(1, ...owned.map((m) => p.credits[m.id] || 0));
  const royalties = p.history.reduce((a, h) => a + h.creatorShare, 0);

  return (
    <section id="dashboard" className="container-x scroll-mt-20 pb-20">
      <div className="glass overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-white/[0.06] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-accent-soft">Your dashboard</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">Credit balances</h2>
          </div>
          {p.isConnected && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-zinc-300">{shortAddr(p.address!)}</span>
              {chain ? (
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-zinc-300">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: chain.color }} />
                  {chain.name}
                </span>
              ) : (
                <span className="rounded-full border border-rose-500/30 px-3 py-1 text-rose-300">Unsupported network</span>
              )}
              <span className={`rounded-full px-3 py-1 ${p.mode === 'live' ? 'bg-mint/10 text-mint' : 'bg-amber-400/10 text-amber-300'}`}>
                {p.mode === 'live' ? 'On-chain' : 'Demo'}
              </span>
            </div>
          )}
        </div>

        {!p.isConnected ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03]">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="6" width="18" height="13" rx="2.5" />
                <path d="M16 12.5h2M3 9.5h18" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-medium">Connect a wallet to see your credits</h3>
            <p className="mt-2 max-w-sm text-sm text-zinc-500">
              Use Trust Wallet, MetaMask, Binance and 300+ other wallets, or sign up with email or Google. New to crypto? A wallet is created for you.
            </p>
            <div className="mt-6">
              <ConnectButton size="lg" label="Connect wallet or sign up with email" />
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5">
            <div className="p-6 lg:col-span-3 lg:border-r lg:border-white/[0.06]">
              {p.mode === 'demo' && (
                <div className="mb-4 flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-gradient-to-br from-accent/15 via-ink-900/60 to-mint/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3.5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#2775ca] font-semibold text-white" aria-hidden>
                      $
                    </span>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-zinc-400">Wallet balance · demo USDC</div>
                      <div className="mt-0.5 font-mono text-2xl font-medium">
                        {fmtUsd(p.usdc)} <span className="text-sm text-zinc-400">USDC</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-1 sm:items-end">
                    <button onClick={p.faucet} className="btn-ghost !px-4 !py-2">
                      + Get 100 demo USDC
                    </button>
                    <span className="text-[11px] text-zinc-500">Test tokens. No real money is used.</span>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { k: 'Total credits', v: p.totalCredits.toLocaleString() },
                  { k: 'USDC spent', v: fmtUsd(p.totalSpent) },
                  { k: 'Royalties paid', v: fmtUsd(royalties) },
                ].map((s) => (
                  <div key={s.k} className="rounded-xl border border-white/[0.06] bg-ink-900/60 p-4">
                    <div className="text-[11px] uppercase tracking-wider text-zinc-500">{s.k}</div>
                    <div className="mt-1 font-mono text-xl">{s.v}</div>
                  </div>
                ))}
              </div>
              <ul className="mt-6 space-y-4">
                {owned.map((m) => {
                  const c = p.credits[m.id] || 0;
                  return (
                    <li key={m.id}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2.5">
                          <span className={`grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br ${m.gradient} text-[11px] font-semibold`}>{m.glyph}</span>
                          {m.name}
                        </span>
                        <span className="font-mono text-zinc-300">{c.toLocaleString()}</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${m.gradient} transition-all duration-700`}
                          style={{ width: `${(c / maxCredits) * 100}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t border-white/[0.06] p-6 lg:col-span-2 lg:border-t-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-300">Royalty activity</h3>
                {p.mode === 'demo' && p.history.length > 0 && (
                  <button onClick={p.reset} className="text-xs text-zinc-500 hover:text-zinc-300">
                    Reset demo
                  </button>
                )}
              </div>
              {p.history.length === 0 ? (
                <p className="mt-6 rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-zinc-500">
                  No purchases yet. Buy credits above and each royalty split will appear here.
                </p>
              ) : (
                <ol className="mt-4 max-h-80 space-y-2.5 overflow-y-auto pr-1">
                  {p.history.map((h) => {
                    const m = p.models.find((x) => x.id === h.modelId);
                    if (!m) return null;
                    const explorer = CHAIN_META[h.chainId]?.explorer;
                    return (
                      <li key={h.id} className="rounded-xl border border-white/[0.06] bg-ink-900/60 p-3.5">
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            {h.qty} × {m.name}
                          </span>
                          <span className="font-mono">{fmtUsd(h.total)}</span>
                        </div>
                        <div className="mt-2 flex h-1.5 overflow-hidden rounded-full">
                          <div className="bg-mint" style={{ width: '98%' }} />
                          <div className="bg-accent" style={{ width: '2%' }} />
                        </div>
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 text-[11px] text-zinc-500">
                          <span>
                            <span className="text-mint">{fmtUsd(h.creatorShare)}</span> → {m.creatorName} ·{' '}
                            <span className="text-accent-soft">{fmtUsd(h.protocolFee)}</span> fee
                          </span>
                          {h.mode === 'live' && explorer ? (
                            <a href={`${explorer}/tx/${h.ref}`} target="_blank" rel="noreferrer" className="font-mono underline hover:text-zinc-300">
                              {shortAddr(h.ref)}
                            </a>
                          ) : (
                            <span title={h.ref}>signed · {timeAgo(h.at)}</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
