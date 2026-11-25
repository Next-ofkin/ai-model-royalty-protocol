// Shared by the "List your model" form and the API, so both apply the same rules.
export const CATEGORIES = [
  'Language · NLP',
  'Translation',
  'Finance · Tabular',
  'Vision · Image',
  'Audio · Speech',
  'Code',
  'Legal',
  'Health',
  'Agriculture',
  'Other',
] as const;

export const MAX_MODELS_PER_CREATOR = 10;

export type ListingInput = {
  name: string;
  creatorName: string;
  description: string;
  category: string;
  price: number;
  endpointUrl?: string;
  tags: string[];
};

export type CommunityModel = ListingInput & {
  id: number;
  creator: `0x${string}`;
  createdAt: string;
};

export function validateListing(raw: unknown): { ok: true; value: ListingInput } | { ok: false; error: string } {
  const r = (raw ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '');
  const name = str(r.name);
  const creatorName = str(r.creatorName);
  const description = typeof r.description === 'string' ? r.description.trim() : '';
  const category = str(r.category);
  const price = typeof r.price === 'number' ? r.price : Number(r.price);
  const endpointUrl = str(r.endpointUrl);
  const tags = (Array.isArray(r.tags) ? r.tags : str(r.tags).split(','))
    .map((t) => str(t))
    .filter(Boolean)
    .slice(0, 5);

  if (name.length < 3 || name.length > 50) return { ok: false, error: 'Model name must be 3–50 characters.' };
  if (creatorName.length < 2 || creatorName.length > 40) return { ok: false, error: 'Creator or team name must be 2–40 characters.' };
  if (description.length < 20 || description.length > 300) return { ok: false, error: 'Description must be 20–300 characters.' };
  if (!(CATEGORIES as readonly string[]).includes(category)) return { ok: false, error: 'Pick a category.' };
  if (!Number.isFinite(price) || price < 0.001 || price > 1000) return { ok: false, error: 'Price must be between 0.001 and 1,000 USDC.' };
  if (endpointUrl) {
    try {
      const u = new URL(endpointUrl);
      if (u.protocol !== 'https:') throw new Error();
    } catch {
      return { ok: false, error: 'API link must start with https://' };
    }
    if (endpointUrl.length > 300) return { ok: false, error: 'API link is too long.' };
  }
  if (tags.some((t) => t.length > 20)) return { ok: false, error: 'Each tag must be 20 characters or fewer.' };

  return {
    ok: true,
    value: { name, creatorName, description, category, price: Math.round(price * 1e6) / 1e6, endpointUrl: endpointUrl || undefined, tags },
  };
}
