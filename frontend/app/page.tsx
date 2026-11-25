'use client';

import { Dashboard } from '@/components/Dashboard';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { Marketplace } from '@/components/Marketplace';
import { useProtocol } from '@/lib/useProtocol';

export default function Home() {
  const p = useProtocol();
  return (
    <>
      <Header />
      <main>
        <Hero mode={p.mode} />
        <Marketplace p={p} />
        <Dashboard p={p} />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
