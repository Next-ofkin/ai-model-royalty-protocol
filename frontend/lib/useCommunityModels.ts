'use client';

import { useCallback, useEffect, useState } from 'react';
import type { CommunityModel } from './listing';
import type { AIModel } from './models';

const GRADIENTS = [
  'from-rose-400 via-pink-500 to-fuchsia-600',
  'from-lime-400 via-emerald-500 to-teal-600',
  'from-cyan-400 via-sky-500 to-blue-600',
  'from-yellow-300 via-amber-500 to-orange-600',
  'from-violet-400 via-purple-500 to-indigo-600',
];

/** Community listings get ids from 1000 up so they never clash with the featured models. */
export const COMMUNITY_ID_OFFSET = 1000;

export function toAIModel(m: CommunityModel): AIModel {
  return {
    id: COMMUNITY_ID_OFFSET + m.id,
    name: m.name,
    tagline: m.category,
    description: m.description,
    category: m.category,
    creatorName: m.creatorName,
    creator: m.creator,
    price: m.price,
    royaltyBps: 9800,
    inferences: 0,
    latencyMs: 0,
    tags: m.tags,
    gradient: GRADIENTS[m.id % GRADIENTS.length],
    glyph: m.name.trim().charAt(0).toUpperCase() || '◆',
    community: true,
    endpointUrl: m.endpointUrl,
    dbId: m.id,
  };
}

export function useCommunityModels() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch('/api/models', { cache: 'no-store' });
      if (!r.ok) return setModels([]);
      const d = (await r.json()) as { models: CommunityModel[] };
      setModels(d.models.map(toAIModel));
    } catch {
      setModels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { models, loading, refresh };
}
