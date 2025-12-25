'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import SimpleHeader from '@/components/Header/SimpleHeader'
import { AuthProvider } from '@/contexts/AuthContext'

export default function LayoutWrapper({
                                          children
                                      }: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    return (
        <AuthProvider>
            {isLoginPage ? <SimpleHeader /> : <Header />}
            <main className="flex-1">
                {children}
            </main>
            {!isLoginPage && <Footer />}
        </AuthProvider>
    )
}