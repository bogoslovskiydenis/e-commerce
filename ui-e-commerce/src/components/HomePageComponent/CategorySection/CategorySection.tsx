'use client'

import Link from 'next/link'
import Image from 'next/image'

interface Category {
    name: string;
    image: string;
    href: string;
    count: string;
}

interface CategorySectionProps {
    title: string;
    subtitle?: string;
    categories: Category[];
    columns?: 2 | 3 | 4 | 5;
    bgColor?: string;
}

export default function CategorySection({
                                            title,
                                            subtitle,
                                            categories,
                                            columns = 5,
                                            bgColor = 'bg-white'
                                        }: CategorySectionProps) {
    // Map number of columns to grid classes
    const columnClasses = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
    }

    return (
        <div className={`${bgColor} py-8 sm:py-12 lg:py-16`}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className={`grid ${columnClasses[columns]} gap-3 sm:gap-6`}>
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200"
                        >
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-white">
                                <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-1 leading-tight">
                                    {category.name}
                                </h3>
                                <p className="text-xs sm:text-sm opacity-90">
                                    {category.count} товаров
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}