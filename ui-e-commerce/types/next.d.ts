import { NextConfig } from 'next';

declare module 'next' {
    interface NextConfig {
        reactStrictMode?: boolean;
        swcMinify?: boolean;
        images?: {
            domains?: string[];
        };
        experimental?: {
            optimizeCss?: boolean;
        };
    }
}

export {};