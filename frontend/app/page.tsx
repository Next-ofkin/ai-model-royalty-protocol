'use client';

import { Dashboard } from '@/components/Dashboard';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { Marketplace } from '@/components/Marketplace';
import { useProtocol } from '@/lib/useProtocol';
import { useCommunityModels } from '@/lib/useCommunityModels';
import { MODELS } from '@/lib/models';
import { useMemo } from 'react';

export default function Home() {
  const community = useCommunityModels();
  const all = useMemo(() => [...MODELS, ...community.models], [community.models]);
  const p = useProtocol(all);
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
