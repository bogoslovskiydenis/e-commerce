import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Ecommerce - Інтернет-магазин одягу',
    description: 'Купити одяг, взуття та аксесуари',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="uk">
        <body className={`${inter.className} bg-background text-text`}>
        <Header />
        {children}
        </body>
        </html>
    )
}