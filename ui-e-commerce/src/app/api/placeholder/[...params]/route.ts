import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ params: string[] }> }
) {
    const { params: paramArray } = await params;
    const [width = '300', height = '300'] = paramArray || [];

    const w = parseInt(width, 10) || 300;
    const h = parseInt(height, 10) || 300;

    // Создаем SVG placeholder
    const svg = `
        <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#e5e7eb"/>
            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">
                ${w}x${h}
            </text>
        </svg>
    `.trim();

    return new NextResponse(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    });
}
