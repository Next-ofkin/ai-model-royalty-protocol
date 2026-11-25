/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { webpack }) => {
    // WalletConnect / MetaMask SDK pull in optional node-only deps
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.resolve.fallback = { ...config.resolve.fallback, '@react-native-async-storage/async-storage': false };
    // Coinbase's SDK references optional x402 payment packages this app never uses.
    config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /^@x402\// }));
    return config;
  },
};
module.exports = nextConfig;
