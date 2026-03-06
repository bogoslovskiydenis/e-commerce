/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3001',
                pathname: '/uploads/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3001',
                pathname: '/api/placeholder/**',
            },
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
        unoptimized: false,
        formats: ['image/avif', 'image/webp'],
    },
}

module.exports = nextConfig