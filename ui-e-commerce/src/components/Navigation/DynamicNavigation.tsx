'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Category, apiService } from '@/services/api'
import { DynamicDropdownMenu } from './DynamicDropdownMenu'
import { BalloonsDropdownMenu } from './BalloonsDropdownMenu'

interface NavigationItem {
    id: string;
    title: string;
    href: string;
    slug?: string;
    isSpecial?: boolean;
    hasDropdown?: boolean;
    type: string;
    order: number;
    children?: Category[];
}

export default function DynamicNavigation() {
    const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Загрузка категорий из админ панели
    useEffect(() => {
        loadNavigationData();
    }, []);

    const loadNavigationData = async () => {
        try {
            setIsLoading(true);
            const categories = await apiService.getNavigationCategories();

            // Преобразуем категории в элементы навигации (только родительские категории)
            const items = categories.map(category => ({
                id: category.id,
                title: category.name,
                href: category.href || `/${category.slug}`,
                slug: category.slug,
                hasDropdown: (category.children && category.children.length > 0) || 
                           (category._count?.products > 0) || 
                           (category.childrenProductsCount > 0),
                type: category.type,
                order: category.sortOrder || category.order || 0,
                children: category.children,
                isSpecial: category.type === 'promotions' || category.slug === 'sale'
            }));

            // Добавляем специальные пункты меню
            const specialItems = [
                {
                    id: 'sale',
                    title: 'Акции',
                    href: '/sale',
                    type: 'promotions',
                    order: 999,
                    isSpecial: true,
                    hasDropdown: false
                }
            ];

            // Сортируем по order
            const allItems = [...items, ...specialItems].sort((a, b) => {
                return (a.order || 0) - (b.order || 0);
            });
            setNavigationItems(allItems);
        } catch (error) {
            console.error('Error loading navigation data:', error);
            // Загружаем резервную навигацию
            loadFallbackNavigation();
        } finally {
            setIsLoading(false);
        }
    };

    // Резервная навигация
    const loadFallbackNavigation = () => {
        const fallbackItems: NavigationItem[] = [
            {
                id: '1',
                title: 'Шарики',
                href: '/balloons',
                hasDropdown: true,
                type: 'balloons',
                order: 1
            },
            {
                id: '2',
                title: 'Букеты из шаров',
                href: '/bouquets',
                hasDropdown: true,
                type: 'bouquets',
                order: 2
            },
            {
                id: '3',
                title: 'Стаканчики',
                href: '/cups',
                hasDropdown: true,
                type: 'cups',
                order: 3
            },
            {
                id: '4',
                title: 'Подарки',
                href: '/gifts',
                hasDropdown: true,
                type: 'gifts',
                order: 4
            },
            {
                id: '5',
                title: 'Наборы',
                href: '/sets',
                hasDropdown: true,
                type: 'sets',
                order: 5
            },
            {
                id: 'sale',
                title: 'Акции',
                href: '/sale',
                isSpecial: true,
                type: 'promotions',
                order: 999
            }
        ];
        setNavigationItems(fallbackItems);
    };

    const handleMouseEnter = (itemId: string) => {
        setHoveredItem(itemId);
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    if (isLoading) {
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
                                        style={{ width: `${Math.random() * 60 + 60}px` }}
                                    />
                                ))}
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
                                className={`nav-item ${hoveredItem === item.id ? 'hovered' : ''}`}
                                onMouseEnter={() => handleMouseEnter(item.id)}
                                onMouseLeave={handleMouseLeave}
                                style={{
                                    background: hoveredItem === item.id ? '#f3f4f6' : 'transparent'
                                }}
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
                                </Link>

                                {item.hasDropdown && hoveredItem === item.id && (
                                    <div className="nav-dropdown">
                                        {/* Специальный dropdown для категории "Шарики" */}
                                        {(item.title.toLowerCase().includes('шарик') || 
                                          item.slug === 'balloons' || 
                                          item.slug === 'шарики') ? (
                                            <BalloonsDropdownMenu
                                                categoryId={item.id}
                                                categoryName={item.title}
                                                children={item.children}
                                            />
                                        ) : (
                                            <DynamicDropdownMenu
                                                categoryType={item.type}
                                                categoryId={item.id}
                                                categoryName={item.title}
                                                children={item.children}
                                            />
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Кнопка обновления для админов */}
            {process.env.NODE_ENV === 'development' && (
                <button
                    onClick={loadNavigationData}
                    className="fixed bottom-4 right-4 bg-teal-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-teal-700 transition-colors z-50"
                    title="Обновить навигацию"
                >
                    🔄 Обновить
                </button>
            )}

            <style jsx>{`
                .nav-item {
                    position: relative;
                }
                
                .nav-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    z-index: 50;
                    min-width: 240px;
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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
                
                .nav-item:hover {
                    background: #f3f4f6;
                }
            `}</style>
        </div>
    );
}