interface Category {
    name: string
    count: number
    href: string
}

const categories: Category[] = [
    { name: 'Чоловіки', count: 48113, href: '/choloviky' },
    { name: 'Жінки', count: 87890, href: '/zinky' },
    { name: 'Одяг', count: 44424, href: '/odyag' },
    { name: 'Взуття', count: 26734, href: '/vzuttya' },
    //больше категорий
]

export default function Sidebar() {
    return (
        <aside className="w-64 flex-shrink-0">
            <nav className="space-y-1">
                {categories.map((category) => (
                    <a
                        key={category.href}
                        href={category.href}
                        className="flex items-center justify-between px-2 py-2 text-sm rounded-lg hover:bg-gray-50"
                    >
                        <span>{category.name}</span>
                        <span className="text-gray-500">{category.count}</span>
                    </a>
                ))}
            </nav>
        </aside>
    )
}
