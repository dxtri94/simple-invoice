/**
 * @type {import('next').NextConfig}
 */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  webpack(config) {
    return config;
  },
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/invoices',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig;
