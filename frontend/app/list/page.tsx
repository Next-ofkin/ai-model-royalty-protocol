'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ConnectButton } from '@/components/ConnectButton';
import { SignInButton } from '@/components/SignInButton';
import { errMsg, useAuth } from '@/lib/auth';
import { CATEGORIES, MAX_MODELS_PER_CREATOR, validateListing } from '@/lib/listing';
import { PROTOCOL_FEE_BPS, fmtUsd, shortAddr } from '@/lib/models';
import { useCommunityModels } from '@/lib/useCommunityModels';

const EMPTY = {
  name: '',
  creatorName: '',
  description: '',
  category: '',
  price: '0.10',
  endpointUrl: '',
  tags: '',
};

function Step({ n, title, done, children }: { n: number; title: string; done: boolean; children?: React.ReactNode }) {
  return (
    <li className={`glass flex items-start gap-4 p-5 ${done ? 'border-mint/25' : ''}`}>
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-sm ${
          done ? 'bg-mint text-ink-950' : 'border border-white/15 text-zinc-400'
        }`}
      >
        {done ? '✓' : n}
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-medium">{title}</div>
        {children && <div className="mt-3">{children}</div>}
      </div>
    </li>
  );
}

const inputCls =
  'mt-1.5 w-full rounded-xl border border-white/10 bg-ink-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

export default function ListPage() {
  const { isConnected, address } = useAccount();
  const { user, dbReady, loading } = useAuth();
  const community = useCommunityModels();
  const [f, setF] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const mine = useMemo(
    () => community.models.filter((m) => address && m.creator.toLowerCase() === address.toLowerCase()),
    [community.models, address],
  );

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  const price = Number(f.price) || 0;
  const fee = (price * PROTOCOL_FEE_BPS) / 10_000;
  const tags = f.tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 5);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const v = validateListing({ ...f, price, tags });
    if (!v.ok) return setMsg({ ok: false, text: v.error });
    setBusy(true);
    try {
      const r = await fetch('/api/models', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(v.value),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Could not list your model.');
      setMsg({ ok: true, text: `${v.value.name} is live in the marketplace.` });
      setF(EMPTY);
      community.refresh();
    } catch (err) {
      setMsg({ ok: false, text: errMsg(err) });
    } finally {
      setBusy(false);
    }
  }

  async function remove(dbId: number, name: string) {
    if (!window.confirm(`Remove "${name}" from the marketplace?`)) return;
    const r = await fetch(`/api/models/${dbId}`, { method: 'DELETE' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) setMsg({ ok: false, text: d.error || 'Could not remove it.' });
    community.refresh();
  }

  const canList = isConnected && !!user && dbReady;

  return (
    <>
      <Header />
      <main className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]" />

        <section className="container-x relative pb-20 pt-14 sm:pt-20">
          <div className="max-w-2xl">
            <span className="eyebrow">For AI builders</span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              <span className="text-gradient">List your AI model</span>
            </h1>
            <p className="mt-4 text-zinc-400 sm:text-lg">
              Sign in with your wallet, set a price per use, and your model appears in the marketplace. Every sale sends 98% to
              your wallet in the same transaction.
            </p>
          </div>

          {!loading && !dbReady && (
            <div className="mt-8 rounded-xl border border-amber-400/30 bg-amber-400/10 px-5 py-4 text-sm text-amber-200">
              Listings are being set up and will open shortly. You can still try buying credits on the{' '}
              <Link href="/#models" className="underline">
                featured models
              </Link>
              .
            </div>
          )}

          <div className="mt-10 grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ol className="space-y-3">
                <Step n={1} title="Connect a wallet, or sign up with email" done={isConnected}>
                  {!isConnected && <ConnectButton label="Connect or sign up" />}
                </Step>
                <Step n={2} title="Sign in (free, no transaction)" done={!!user}>
                  {isConnected && !user && (
                    <div className="space-y-2">
                      <p className="text-sm text-zinc-400">
                        Your wallet signs a one-time message to prove it&apos;s you. Nothing is sent and there&apos;s no fee.
                      </p>
                      <SignInButton />
                    </div>
                  )}
                </Step>
                <Step n={3} title="Describe your model" done={false} />
              </ol>

              <form onSubmit={submit} className={`glass mt-4 space-y-5 p-6 ${canList ? '' : 'pointer-events-none opacity-50'}`} aria-disabled={!canList}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="text-zinc-300">Model name</span>
                    <input className={inputCls} value={f.name} onChange={set('name')} placeholder="e.g. Hausa Speech-to-Text" maxLength={50} required />
                  </label>
                  <label className="block text-sm">
                    <span className="text-zinc-300">Your name or team</span>
                    <input className={inputCls} value={f.creatorName} onChange={set('creatorName')} placeholder="e.g. Kano AI Lab" maxLength={40} required />
                  </label>
                </div>
                <label className="block text-sm">
                  <span className="text-zinc-300">What does it do?</span>
                  <textarea
                    className={`${inputCls} min-h-[96px] resize-y`}
                    value={f.description}
                    onChange={set('description')}
                    placeholder="One or two sentences buyers will understand."
                    maxLength={300}
                    required
                  />
                  <span className="mt-1 block text-right text-xs text-zinc-600">{f.description.length}/300</span>
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="text-zinc-300">Category</span>
                    <select className={inputCls} value={f.category} onChange={set('category')} required>
                      <option value="" disabled>
                        Choose one
                      </option>
                      {CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm">
                    <span className="text-zinc-300">Price per use (USDC)</span>
                    <input className={inputCls} type="number" inputMode="decimal" min="0.001" max="1000" step="0.001" value={f.price} onChange={set('price')} required />
                    <span className="mt-1 block text-xs text-zinc-500">
                      You get <span className="text-mint">{fmtUsd(price - fee)}</span> · fee {fmtUsd(fee)}
                    </span>
                  </label>
                </div>
                <label className="block text-sm">
                  <span className="text-zinc-300">
                    API link <span className="text-zinc-600">(optional)</span>
                  </span>
                  <input className={inputCls} type="url" value={f.endpointUrl} onChange={set('endpointUrl')} placeholder="https://api.yourmodel.com/v1" />
                  <span className="mt-1 block text-xs text-zinc-500">Where your model runs. Buyers&apos; requests will be sent here.</span>
                </label>
                <label className="block text-sm">
                  <span className="text-zinc-300">
                    Tags <span className="text-zinc-600">(up to 5, comma separated)</span>
                  </span>
                  <input className={inputCls} value={f.tags} onChange={set('tags')} placeholder="Hausa, speech, fast" />
                </label>

                {msg && (
                  <p className={`rounded-lg px-3.5 py-2.5 text-sm ${msg.ok ? 'bg-mint/10 text-mint' : 'bg-rose-500/10 text-rose-300'}`}>
                    {msg.text}{' '}
                    {msg.ok && (
                      <Link href="/#models" className="underline">
                        View marketplace →
                      </Link>
                    )}
                  </p>
                )}

                <button type="submit" className="btn-primary w-full sm:w-auto" disabled={!canList || busy}>
                  {busy ? 'Listing…' : 'List my model'}
                </button>
              </form>
            </div>

            <aside className="space-y-6 lg:col-span-2">
              <div>
                <div className="mb-3 text-sm font-medium text-zinc-400">Live preview</div>
                <article className="glass p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-accent to-mint text-xl font-semibold">
                      {(f.name.trim()[0] || '?').toUpperCase()}
                    </div>
                    <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-zinc-400">{f.category || 'Category'}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{f.name || 'Your model name'}</h3>
                  <p className="text-sm text-zinc-500">
                    by <span className="text-zinc-300">{f.creatorName || 'You'}</span>{' '}
                    {address && <span className="font-mono text-xs text-zinc-600">{shortAddr(address)}</span>}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{f.description || 'Your description appears here.'}</p>
                  {tags.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {tags.map((t) => (
                        <li key={t} className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[11px] text-zinc-400">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <span className="font-mono text-sm">${fmtUsd(price)} / use</span>
                    <span className="text-xs text-mint">98% to you</span>
                  </div>
                </article>
              </div>

              {isConnected && (
                <div>
                  <div className="mb-3 text-sm font-medium text-zinc-400">
                    Your listings ({mine.length}/{MAX_MODELS_PER_CREATOR})
                  </div>
                  {mine.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-white/10 p-5 text-sm text-zinc-500">Nothing listed yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {mine.map((m) => (
                        <li key={m.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-ink-900/60 px-4 py-3 text-sm">
                          <span className="min-w-0 truncate">
                            {m.name} <span className="font-mono text-xs text-zinc-500">${fmtUsd(m.price)}</span>
                          </span>
                          {user && (
                            <button onClick={() => remove(m.dbId!, m.name)} className="shrink-0 text-xs text-zinc-500 hover:text-rose-300">
                              Remove
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
