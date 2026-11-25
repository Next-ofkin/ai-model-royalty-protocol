export type AIModel = {
  id: number;
  name: string;
  tagline: string;
  description: string;
  category: string;
  creatorName: string;
  creator: `0x${string}`;
  /** Price per inference in USDC */
  price: number;
  royaltyBps: number;
  inferences: number;
  latencyMs: number;
  tags: string[];
  /** Tailwind gradient classes for the card glyph */
  gradient: string;
  glyph: string;
};

export const MODELS: AIModel[] = [
  {
    id: 1,
    name: 'LexAnalyzer-7B',
    tagline: 'Contract intelligence',
    description:
      'Fine-tuned legal LLM that reads contracts, extracts key clauses, flags risky terms and produces a plain-English summary.',
    category: 'Legal · NLP',
    creatorName: 'Lumen Labs',
    creator: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    price: 0.5,
    royaltyBps: 9800,
    inferences: 128_430,
    latencyMs: 820,
    tags: ['Clause extraction', 'Risk flags', '32k context'],
    gradient: 'from-violet-500 via-fuchsia-500 to-pink-500',
    glyph: '§',
  },
  {
    id: 2,
    name: 'Naija Translate',
    tagline: 'African languages',
    description:
      'High-accuracy translation between English and Yoruba, Igbo, Hausa and Nigerian Pidgin, tuned on local news and speech corpora.',
    category: 'Translation',
    creatorName: 'Ọ̀rọ̀ AI',
    creator: '0x8a3F7c1B2d4E5f6A7b8C9d0E1f2A3b4C5d6E9b21',
    price: 0.25,
    royaltyBps: 9800,
    inferences: 342_918,
    latencyMs: 310,
    tags: ['Yoruba', 'Igbo', 'Hausa', 'Pidgin'],
    gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    glyph: 'Ọ',
  },
  {
    id: 3,
    name: 'CreditSense',
    tagline: 'Risk scoring',
    description:
      'Gradient-boosted credit risk model that scores borrowers from bank-statement features. Built for salary lenders and fintechs.',
    category: 'Finance · Tabular',
    creatorName: 'Ledgerline',
    creator: '0x1c9E4b2A7d3F8e6C5b4A3d2E1f0a9B8c7D6e4F77',
    price: 1.0,
    royaltyBps: 9800,
    inferences: 61_207,
    latencyMs: 95,
    tags: ['XGBoost', 'Explainable', 'AUC 0.87'],
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    glyph: '◎',
  },
  {
    id: 4,
    name: 'PixelForge XL',
    tagline: 'Image generation',
    description:
      'Diffusion model for product shots and marketing visuals at 1024px, with brand-style presets and a commercial-use licence per image.',
    category: 'Vision · Diffusion',
    creatorName: 'Studio Ashé',
    creator: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
    price: 0.08,
    royaltyBps: 9800,
    inferences: 905_164,
    latencyMs: 2400,
    tags: ['1024px', 'Style presets', 'Commercial licence'],
    gradient: 'from-sky-400 via-indigo-500 to-violet-600',
    glyph: '◈',
  },
];

export const PROTOCOL_FEE_BPS = 200;

export function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function fmtUsd(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: n < 1 ? 3 : 2 });
}
