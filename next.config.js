/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cryptologos.cc', 'assets.coingecko.com'], // Add the domain here
    unoptimized: true
  },
  
}

module.exports = nextConfig
