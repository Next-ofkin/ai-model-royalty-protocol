import { base, mainnet, polygon } from 'wagmi/chains';
import { parseAbi, isAddress, type Address } from 'viem';

export const royaltyAbi = parseAbi([
  'function paymentToken() view returns (address)',
  'function protocolFeeBps() view returns (uint256)',
  'function models(uint256) view returns (address creator, string metadataURI, uint256 pricePerInference, uint256 royaltyBps, uint256 totalInferences, bool active)',
  'function userCredits(uint256 modelId, address user) view returns (uint256)',
  'function purchaseInferences(uint256 modelId, uint256 numInferences)',
  'function consumeInference(uint256 modelId)',
]);

export const erc20Abi = parseAbi([
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function balanceOf(address) view returns (uint256)',
]);

function addr(v: string | undefined): Address | undefined {
  return v && isAddress(v) ? (v as Address) : undefined;
}

/** Deployed protocol addresses per chain. Unset → demo mode on that chain. */
export const CONTRACTS: Record<number, Address | undefined> = {
  [base.id]: addr(process.env.NEXT_PUBLIC_CONTRACT_BASE),
  [mainnet.id]: addr(process.env.NEXT_PUBLIC_CONTRACT_MAINNET),
  [polygon.id]: addr(process.env.NEXT_PUBLIC_CONTRACT_POLYGON),
};

export const CHAIN_META: Record<number, { name: string; color: string; explorer: string }> = {
  [base.id]: { name: 'Base', color: '#3b82f6', explorer: 'https://basescan.org' },
  [mainnet.id]: { name: 'Ethereum', color: '#a5b4fc', explorer: 'https://etherscan.io' },
  [polygon.id]: { name: 'Polygon', color: '#a855f7', explorer: 'https://polygonscan.com' },
};
