/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost'],
    },
    experimental: {
        optimizeCss: false // Отключаем optimizeCss, который использует critters
    },
};

module.exports = nextConfig;