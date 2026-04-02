import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import LayoutWrapper from '@/components/LayoutWrapper/LayoutWrapper'
import { getServerLanguage } from '@/lib/serverLanguage'
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const initialLanguage = await getServerLanguage()

    return (
        <html lang={initialLanguage} suppressHydrationWarning>
            <body
                className={`${inter.className} bg-background text-text min-h-screen flex flex-col relative`}
            >
                <LayoutWrapper initialLanguage={initialLanguage}>{children}</LayoutWrapper>
            </body>
        </html>
    )
}
