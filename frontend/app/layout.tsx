import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './globals.css';
import { Providers } from './providers';

const description =
  'Register AI models, sell inference credits in USDC, and pay creators their royalties automatically on-chain. Live on Base, Ethereum and Polygon.';

export const metadata: Metadata = {
  title: 'AI Model Royalty Protocol — On-chain licensing for AI models',
  description,
  authors: [{ name: 'Excel Shogbola', url: 'https://portfolio.dastrings.name.ng' }],
  keywords: ['AI', 'Web3', 'royalties', 'smart contract', 'USDC', 'Base', 'RainbowKit', 'wagmi'],
  openGraph: {
    title: 'AI Model Royalty Protocol',
    description,
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'AI Model Royalty Protocol', description },
};

export const viewport: Viewport = {
  themeColor: '#07080c',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
