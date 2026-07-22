/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Next.js 16's Proxy layer caps request bodies at 10MB by default, well
    // under the 25MB PDF uploads this app needs to support. Raise it with
    // headroom above the 25MB app-level limit we enforce ourselves.
    proxyClientMaxBodySize: '30mb',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}

module.exports = nextConfig
