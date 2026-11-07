import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // Admin-аас зураг байршуулахад (8 зураг × 5MB хүртэл)
    serverActions: { bodySizeLimit: '45mb' },
  },
}

export default nextConfig
