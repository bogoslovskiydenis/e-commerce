import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import LayoutWrapper from '@/components/LayoutWrapper/LayoutWrapper'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Ecommerce',
    description: 'Шарики',
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="uk">
        <body className={`${inter.className} bg-background text-text min-h-screen flex flex-col relative`}>
        <LayoutWrapper>
            {children}
        </LayoutWrapper>
        </body>
        </html>
    )
}