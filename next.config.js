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
  async redirects() {
    return [
      // The "Sister Concerns" section was renamed to "Our Facilities". Keep the
      // old public URLs working for bookmarks, search results and any links
      // that were shared before the rename.
      {
        source: '/sister-concerns',
        destination: '/our-facilities',
        permanent: true,
      },
      {
        source: '/sister-concerns/:slug',
        destination: '/our-facilities/:slug',
        permanent: true,
      },
      {
        source: '/admin/sister-concerns',
        destination: '/admin/our-facilities',
        permanent: true,
      },
      // 308 preserves the method and body, so an admin tab still running the
      // pre-rename JS keeps working against the old endpoints.
      {
        source: '/api/sister-concerns',
        destination: '/api/our-facilities',
        permanent: true,
      },
      {
        source: '/api/admin/sister-concerns',
        destination: '/api/admin/our-facilities',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
