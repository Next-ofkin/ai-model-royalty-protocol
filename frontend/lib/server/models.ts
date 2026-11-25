import 'server-only';
import type { CommunityModel } from '@/lib/listing';

export type Row = {
  id: number;
  creator: string;
  creator_name: string;
  name: string;
  description: string;
  category: string;
  price_usdc: string;
  endpoint_url: string | null;
  tags: string[];
  created_at: Date;
};

export function toModel(r: Row): CommunityModel {
  return {
    id: r.id,
    creator: r.creator as `0x${string}`,
    creatorName: r.creator_name,
    name: r.name,
    description: r.description,
    category: r.category,
    price: Number(r.price_usdc),
    endpointUrl: r.endpoint_url ?? undefined,
    tags: r.tags,
    createdAt: r.created_at.toISOString(),
  };
}

