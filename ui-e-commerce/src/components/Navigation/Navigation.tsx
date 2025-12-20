'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useNavigation } from '@/hooks/useNavigation'

interface NavigationItem {
    id: string;
    title: string;
    href: string;
    isSpecial?: boolean;
    hasDropdown?: boolean;
    type?: string;
    children?: any[];
    productsCount?: number;
}

export default function Navigation() {
    const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    // Получаем категории из API
    const { categories, isLoading, error } = useNavigation();

    // Обновляем навигацию при загрузке категорий
    useEffect(() => {
        if (categories.length > 0) {
            console.log('📋 Категории из API:', categories);

            // Преобразуем категории в элементы навигации
            const apiItems: NavigationItem[] = categories.map(category => ({
                id: category.id,
                title: category.name,
                href: category.href || `/${category.slug}`,
                hasDropdown: (category.children && category.children.length > 0) || category.productsCount > 0,
                type: category.type,
                children: category.children,
                productsCount: category.productsCount
            }));

            // Добавляем специальные пункты
            const specialItems: NavigationItem[] = [
                {
                    id: 'sale',
                    title: 'Акции',
                    href: '/sale',
                    isSpecial: true
                },
            ];

            const allItems = [...apiItems, ...specialItems];
            console.log('🔄 Элементы навигации:', allItems);
            setNavigationItems(allItems);
        } else {
            // Резервная навигация если API недоступно
            console.log('⚠️ Используем резервную навигацию');
            setNavigationItems([
                { id: '1', title: 'Шарики', href: '/balloons', hasDropdown: true },
                { id: '2', title: 'Букеты из шаров', href: '/bouquets', hasDropdown: true },
                { id: '3', title: 'Стаканчики', href: '/cups', hasDropdown: true },
                { id: '4', title: 'Подарки', href: '/gifts', hasDropdown: true },
                { id: '5', title: 'Наборы', href: '/sets', hasDropdown: true },
                { id: 'sale', title: 'Акции', href: '/sale', isSpecial: true },
            ]);
        }
    }, [categories]);

    const handleMouseEnter = (title: string) => {
        setHoveredItem(title);
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    // Функция для получения содержимого дропдауна
    const getDropdownContent = (item: NavigationItem) => {
        if (item.children && item.children.length > 0) {
            return item.children.map((child: any) => ({
                name: child.name,
                href: child.href || `/${child.slug}`,
                count: child.productsCount || 0
            }));
        }

        // Статические подкатегории для резервной навигации
        const staticDropdowns: Record<string, any[]> = {
            'Шарики': [
                { name: 'Фольгированные шары', href: '/balloons/foil', count: 120 },
                { name: 'Латексные шары', href: '/balloons/latex', count: 87 }
            ],
            'Букеты из шаров': [
                { name: 'Букеты для детей', href: '/bouquets/kids', count: 45 },
                { name: 'Романтические букеты', href: '/bouquets/romantic', count: 67 }
            ],
            'Стаканчики': [
                { name: 'Бумажные стаканчики', href: '/cups/paper', count: 45 },
                { name: 'Пластиковые стаканчики', href: '/cups/plastic', count: 30 }
            ],
            'Подарки': [
                { name: 'Мягкие игрушки', href: '/gifts/plush', count: 89 },
                { name: 'Сувениры', href: '/gifts/souvenirs', count: 67 }
            ],
            'Наборы': [
                { name: 'Готовые праздничные наборы', href: '/sets/party', count: 34 },
                { name: 'Наборы для дня рождения', href: '/sets/birthday', count: 45 }
            ]
        };

        return staticDropdowns[item.title] || [];
    };

    // Показываем индикатор загрузки
    if (isLoading) {
        // Фиксированные значения для предотвращения hydration mismatch
        const skeletonWidths = [80, 100, 90, 85, 95];
        return (
            <div className="relative">
                <nav className="bg-white border-t border-b">
                    <div className="container mx-auto">
                        <div className="flex items-center h-14">
                            <div className="flex space-x-6">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div
                                        key={i}
                                        className="h-4 bg-gray-200 rounded animate-pulse"
                                        style={{ width: `${skeletonWidths[i - 1]}px` }}
                                    />
                                ))}
                            </div>
                            <div className="ml-4 text-sm text-blue-600">
                                🔄 Загружаем навигацию из админ панели...
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }

    return (
        <div className="relative">
            <nav className="bg-white border-t border-b">
                <div className="container mx-auto">
                    <ul className="flex">
                        {navigationItems.map((item) => (
                            <li
                                key={item.id}
                                className={`nav-item ${hoveredItem === item.title ? 'hovered' : ''}`}
                                onMouseEnter={() => handleMouseEnter(item.title)}
                                onMouseLeave={handleMouseLeave}
                                style={{ background: hoveredItem === item.title ? '#f3f4f6' : 'transparent' }}
                            >
                                <Link
                                    href={item.href}
                                    className={`nav-link block px-6 py-4 text-sm transition-colors ${
                                        item.isSpecial
                                            ? 'text-red-600 font-semibold hover:text-red-700'
                                            : 'text-gray-900 hover:text-teal-600'
                                    }`}
                                >
                                    {item.title}
                                    {/* Показываем количество товаров для отладки */}
                                    {item.productsCount && (
                                        <span className="ml-1 text-xs text-gray-500">
                                            ({item.productsCount})
                                        </span>
                                    )}
                                </Link>

                                {/* Простой дропдаун */}
                                {item.hasDropdown && hoveredItem === item.title && (
                                    <div className="absolute top-full left-0 z-50 min-w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-gray-900 mb-3">
                                                {item.title}
                                            </h3>

                                            {getDropdownContent(item).map((subItem: any, index: number) => (
                                                <Link
                                                    key={index}
                                                    href={subItem.href}
                                                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                                >
                                                    <span className="text-sm text-gray-700 group-hover:text-teal-600">
                                                        {subItem.name}
                                                    </span>
                                                    {subItem.count > 0 && (
                                                        <span className="text-xs text-gray-400">
                                                            {subItem.count}
                                                        </span>
                                                    )}
                                                </Link>
                                            ))}

                                            <div className="pt-2 border-t">
                                                <Link
                                                    href={item.href}
                                                    className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                                                >
                                                    Смотреть все {item.title.toLowerCase()} →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Индикатор статуса API */}
            {error && (
                <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
                    <div className="container mx-auto">
                        <div className="text-sm text-yellow-700">
                            ⚠️ {error}
                        </div>
                    </div>
                </div>
            )}

            {/* Кнопка обновления для разработчиков */}
            {process.env.NODE_ENV === 'development' && (
                <button
                    onClick={() => window.location.reload()}
                    className="fixed bottom-4 right-4 bg-teal-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-teal-700 transition-colors z-50 text-sm"
                    title="Обновить навигацию"
                >
                    🔄 Обновить
                </button>
            )}

            <style jsx>{`
                .nav-item {
                    position: relative;
                }
                
                .nav-item:hover {
                    background: #f3f4f6;
                }
                
                .nav-dropdown {
                    animation: slideDown 0.2s ease-out;
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}