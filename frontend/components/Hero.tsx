import { MODELS } from '@/lib/models';

const totalInferences = MODELS.reduce((a, m) => a + m.inferences, 0);
const volume = MODELS.reduce((a, m) => a + m.inferences * m.price, 0);

const STATS = [
  { label: 'Inferences settled', value: totalInferences.toLocaleString('en-US') },
  { label: 'Royalty volume', value: `$${Math.round(volume).toLocaleString('en-US')}` },
  { label: 'Creator share', value: '98%' },
  { label: 'Networks', value: '3 EVM chains' },
];

export function Hero({ mode }: { mode: 'demo' | 'live' }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />
      <div className="pointer-events-none absolute -top-10 right-[-10%] h-[300px] w-[400px] rounded-full bg-mint/10 blur-[100px]" />

      <div className="container-x relative pb-16 pt-16 sm:pb-24 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow animate-fade-up">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
            </span>
            {mode === 'live' ? 'Live on-chain' : 'Interactive demo · no funds needed'}
          </span>
          <h1
            className="mt-6 animate-fade-up text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl"
            style={{ animationDelay: '80ms' }}
          >
            <span className="text-gradient">Every inference pays</span>
            <br />
            <span className="text-gradient">its creator. Instantly.</span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-2xl animate-fade-up text-base leading-relaxed text-zinc-400 sm:text-lg"
            style={{ animationDelay: '160ms' }}
          >
            An on-chain marketplace where AI builders register models, users buy inference credits in USDC, and the
            smart contract splits every payment between the creator and the protocol in the same transaction.
          </p>
          <div className="mt-9 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: '240ms' }}>
            <a href="#models" className="btn-primary w-full sm:w-auto">
              Explore models
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                <path d="M10.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 1 1-1.4-1.4L13.6 11H4a1 1 0 1 1 0-2h9.6l-3.3-3.3a1 1 0 0 1 0-1.4Z" />
              </svg>
            </a>
            <a href="#how" className="btn-ghost w-full sm:w-auto">
              How it works
            </a>
          </div>
        </div>

        <dl className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-ink-950/90 px-5 py-5 text-center">
              <dt className="text-xs uppercase tracking-wider text-zinc-500">{s.label}</dt>
              <dd className="mt-1.5 font-mono text-base font-medium text-zinc-100 sm:text-lg">{s.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-center text-xs text-zinc-600">Marketplace figures are sample data for the demo.</p>
      </div>
    </section>
  );
}
