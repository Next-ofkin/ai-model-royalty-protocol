const STEPS = [
  {
    n: '01',
    title: 'Creators register models',
    body: 'A builder calls registerModel with an IPFS metadata URI and a price per inference. The model gets an on-chain ID and the creator wallet is locked in as the payee.',
    code: 'registerModel(uri, price, bps)',
  },
  {
    n: '02',
    title: 'Users buy inference credits',
    body: 'Users approve USDC once and call purchaseInferences. The contract pulls the exact cost and adds credits to their balance for that model.',
    code: 'purchaseInferences(id, qty)',
  },
  {
    n: '03',
    title: 'Royalties split instantly',
    body: 'In the same transaction, 98% goes straight to the creator and a 2% protocol fee goes to the treasury. Nothing is held and there are no payout delays.',
    code: 'creator 98% · protocol 2%',
  },
  {
    n: '04',
    title: 'Apps consume credits',
    body: 'Each API call burns one credit with consumeInference, so usage stays auditable on-chain and a balance can never be spent twice.',
    code: 'consumeInference(id)',
  },
];

const FEATURES = [
  { t: 'Reentrancy-guarded', d: 'OpenZeppelin ReentrancyGuard on every payment path.' },
  { t: 'Owner-capped fees', d: 'The protocol fee is hard-capped at 10% in the contract.' },
  { t: 'Any ERC-20', d: 'USDC by default; the payment token is set at deploy.' },
  { t: 'Multi-chain', d: 'One codebase for Base, Ethereum and Polygon.' },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative scroll-mt-20 border-t border-white/[0.06] py-20">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-accent-soft">How it works</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">From model to royalty in one transaction</h2>
          <p className="mt-3 text-zinc-400">
            The whole flow is enforced by a single Solidity contract. No invoices, no middlemen, no waiting for a
            payout cycle.
          </p>
        </div>

        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.n} className="glass relative p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-accent-soft">{s.n}</span>
                {i < STEPS.length - 1 && (
                  <span className="hidden h-px flex-1 translate-x-6 bg-gradient-to-r from-white/15 to-transparent lg:block" />
                )}
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.body}</p>
              <code className="mt-5 block break-words rounded-lg border border-white/[0.06] bg-ink-900 px-3 py-2 font-mono text-xs text-mint">
                {s.code}
              </code>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-2 [&>*]:min-w-0">
          <div className="glass min-w-0 p-6 font-mono text-xs leading-relaxed sm:text-[13px]">
            <div className="mb-4 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="ml-3 text-zinc-500">AIModelRoyaltyProtocol.sol</span>
            </div>
            <pre className="overflow-x-auto text-zinc-400">
              <code>
                <span className="text-accent-soft">uint256</span> protocolFee = (totalCost * protocolFeeBps) / <span className="text-amber-300">10000</span>;{'\n'}
                <span className="text-accent-soft">uint256</span> creatorShare = totalCost - protocolFee;{'\n\n'}
                <span className="text-zinc-600">{'// Immediate distribution'}</span>{'\n'}
                paymentToken.<span className="text-mint">transfer</span>(feeRecipient, protocolFee);{'\n'}
                paymentToken.<span className="text-mint">transfer</span>(model.creator, creatorShare);{'\n\n'}
                userCredits[modelId][msg.sender] += numInferences;
              </code>
            </pre>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <li key={f.t} className="rounded-xl border border-white/[0.06] p-5">
                <div className="flex items-center gap-2 font-medium">
                  <svg viewBox="0 0 20 20" className="h-4 w-4 text-mint" fill="currentColor">
                    <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z" />
                  </svg>
                  {f.t}
                </div>
                <p className="mt-1.5 text-sm text-zinc-500">{f.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
