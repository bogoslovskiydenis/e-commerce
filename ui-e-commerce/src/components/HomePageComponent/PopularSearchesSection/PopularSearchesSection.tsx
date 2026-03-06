'use client'

import Link from 'next/link'

interface PopularSearchesSectionProps {
    title: string;
    queries: string[];
}

export default function PopularSearchesSection({ title, queries }: PopularSearchesSectionProps) {
    if (!queries || queries.length === 0) {
        return null
    }

    return (
        <div className="bg-white py-6 sm:py-8 lg:py-10">
            <div className="container mx-auto px-4">
                <div className="mb-4 sm:mb-6 lg:mb-8">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                        {title}
                    </h2>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                    {queries.map((query) => (
                        <Link
                            key={query}
                            href={`/search?q=${encodeURIComponent(query)}`}
                            className="inline-flex items-center rounded-full border border-teal-500 px-3 py-1.5 text-xs sm:text-sm text-teal-700 hover:bg-teal-50 transition-colors"
                        >
                            {query}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

