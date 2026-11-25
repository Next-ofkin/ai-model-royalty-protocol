'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';

const NAV = [
  { href: '#models', label: 'Models' },
  { href: '#dashboard', label: 'Dashboard' },
  { href: '#how', label: 'How it works' },
  { href: 'https://github.com/Next-ofkin/ai-model-royalty-protocol', label: 'GitHub', external: true },
];

export function Logo({ alwaysShowName = false }: { alwaysShowName?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label="AI Model Royalty Protocol home">
      <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-mint shadow-glow">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z" strokeLinejoin="round" />
          <path d="M12 12 4 7.5M12 12l8-4.5M12 12v9" strokeLinejoin="round" opacity=".6" />
        </svg>
      </span>
      <span className={`${alwaysShowName ? 'inline' : 'hidden min-[440px]:inline'} text-sm font-semibold tracking-tight`}>
        Royalty<span className="text-zinc-500">Protocol</span>
      </span>
    </a>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              target={n.external ? '_blank' : undefined}
              rel={n.external ? 'noreferrer' : undefined}
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ConnectButton chainStatus="icon" accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }} showBalance={false} />
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav className="container-x flex flex-col gap-1 pb-4 md:hidden">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              target={n.external ? '_blank' : undefined}
              rel={n.external ? 'noreferrer' : undefined}
              className="rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/5"
            >
              {n.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
