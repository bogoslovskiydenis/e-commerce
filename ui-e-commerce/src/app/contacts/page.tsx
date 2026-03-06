'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiService, Page } from '@/services/api'
import { useTranslation } from '@/contexts/LanguageContext'

const CONTACTS_SLUG = 'contacts'

export default function ContactsPage() {
    const { t, language } = useTranslation()
    const [page, setPage] = useState<Page | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await apiService.getPageBySlug(CONTACTS_SLUG, language)
                setPage(data)
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : t('contactsPage.loadError'))
                setPage(null)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [language, t])

    useEffect(() => {
        if (!page) return
        const prevTitle = document.title
        document.title = page.metaTitle || `${page.title} | ${prevTitle}`
        let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
        if (page.metaDescription) {
            if (!meta) {
                meta = document.createElement('meta')
                meta.name = 'description'
                document.head.appendChild(meta)
            }
            meta.content = page.metaDescription
        }
        return () => {
            document.title = prevTitle
        }
    }, [page])

    return (
        <div className="container mx-auto px-4 py-8">
            <nav className="mb-6">
                <ol className="flex items-center space-x-2 text-sm">
                    <li>
                        <Link href="/" className="text-gray-500 hover:text-teal-600">
                            {t('cart.homePage')}
                        </Link>
                    </li>
                    <li className="text-gray-400 mx-2">/</li>
                    <li>
                        <span className="text-gray-900">{t('header.contacts')}</span>
                    </li>
                </ol>
            </nav>

            {loading && (
                <div className="py-10 text-center text-gray-500">
                    {t('contactsPage.loading')}
                </div>
            )}

            {!loading && error && (
                <div className="py-10 text-center text-red-600">{error}</div>
            )}

            {!loading && !page && !error && (
                <div className="py-10 text-center text-gray-500">
                    {t('contactsPage.notFound')}
                </div>
            )}

            {!loading && page && (
                <>
                    <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
                    {page.excerpt && (
                        <p className="text-gray-600 mb-6 text-lg">{page.excerpt}</p>
                    )}
                    <div
                        className="page-content text-gray-700 [&_p]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-teal-600 [&_a]:underline"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                </>
            )}
        </div>
    )
}

