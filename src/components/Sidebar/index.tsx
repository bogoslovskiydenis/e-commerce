interface Category {
    name: string
    count: number
    href: string
}

interface SidebarProps {
    categories?: Category[]
}

// Дефолтные категории
const DEFAULT_CATEGORIES: Category[] = [
    { name: 'Одяг', count: 4424, href: '/odyag' },
    { name: 'Взуття', count: 2674, href: '/vzuttya' },
    { name: 'Аксесуари', count: 1523, href: '/aksesuary' },
    { name: 'Спортивний одяг', count: 892, href: '/sport' },
    { name: 'Білизна', count: 567, href: '/bilyzna' }
]

export default function Sidebar({ categories = DEFAULT_CATEGORIES }: SidebarProps) {
    return (
        <aside className="w-64 flex-shrink-0">
            <nav className="space-y-1">
                {categories?.map((category) => (
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