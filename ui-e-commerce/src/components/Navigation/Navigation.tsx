'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useNavigation } from '@/hooks/useNavigation'
import { CategoryDropdownMenu } from './CategoryDropdownMenu'
import { useTranslation } from '@/contexts/LanguageContext'
import { getLocalizedCategoryName } from '@/utils/categoryLocalization'

interface NavigationItem {
    id: string;
    title: string;
    href: string;
    slug?: string;
    isSpecial?: boolean;
    hasDropdown?: boolean;
    type?: string;
    children?: any[];
    productsCount?: number;
    sortOrder?: number;
}

export default function Navigation() {
    const { t, language } = useTranslation()
    const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    // Получаем категории из API
    const { categories, isLoading, error } = useNavigation();

    // Обновляем навигацию при загрузке категорий или смене языка
    useEffect(() => {
        if (categories.length > 0) {
            // Преобразуем категории в элементы навигации (только родительские категории)
            const apiItems: NavigationItem[] = categories
                .filter(category => !category.parentId) // Фильтруем только родительские категории
                .map(category => {
                    const sortOrder = (category as any).sortOrder || category.order || 0;
                    const productsCount = (category as any)._count?.products || category.productsCount || 0;
                    const childrenProductsCount = (category as any).childrenProductsCount || 0;
                    const children = category.children || [];
                    const localizedName = getLocalizedCategoryName(category, language);
                return {
                    id: category.id,
                    title: localizedName,
                    href: category.href || `/${category.slug}`,
                    slug: category.slug,
                    hasDropdown: children.length > 0 || productsCount > 0 || childrenProductsCount > 0,
                    type: category.type,
                    children: children,
                    productsCount: productsCount,
                    sortOrder: sortOrder
                };
                });

            // Добавляем специальные пункты
            const specialItems: NavigationItem[] = [
                {
                    id: 'sale',
                    title: t('navigation.sale'),
                    href: '/sale',
                    isSpecial: true,
                    sortOrder: 999
                },
            ];

            // Сортируем по sortOrder
            const allItems = [...apiItems, ...specialItems].sort((a, b) => {
                return (a.sortOrder || 0) - (b.sortOrder || 0);
            });
            setNavigationItems(allItems);
        }
    }, [categories, language]);

    const handleMouseEnter = (itemId: string) => {
        setHoveredItem(itemId);
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    // Функция для получения содержимого дропдауна
    const getDropdownContent = (item: NavigationItem) => {
        if (item.children && item.children.length > 0) {
            return item.children.map((child: any) => ({
                name: getLocalizedCategoryName(child, language), // Локализованное название подкатегории
                href: child.href || `/${child.slug}`,
                count: child.productsCount || 0
            }));
        }

        // Минимальный fallback - возвращаем пустой массив, т.к. данные должны приходить с API
        return [];
    };

    // Не показываем индикатор загрузки - навигация загружается из кеша мгновенно

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
                                style={{ background: hoveredItem === item.id ? '#f3f4f6' : 'transparent' }}
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

                                {/* Дропдаун с поддержкой специального меню для шариков */}
                                {item.hasDropdown && hoveredItem === item.id && (
                                    <div className="absolute top-full left-0 z-50" style={{ width: 'max-content', minWidth: '900px' }}>
                                        {/* Динамический dropdown меню для категорий с подкатегориями */}
                                        {(item.children && item.children.length > 0) ? (
                                            <CategoryDropdownMenu
                                                categoryId={item.id}
                                                categoryName={item.title}
                                                children={item.children}
                                            />
                                        ) : (
                                            <div className="min-w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                                                <div className="space-y-2">
                                                    <h3 className="font-semibold text-gray-900 mb-3">
                                                        {item.title}
                                                    </h3>

                                                    {getDropdownContent(item).map((subItem: any, index: number) => (
                                                        <Link
                                                            key={index}
                                                            href={subItem.href}
                                                            className="flex items-center justify-between py-2 px-3 pl-6 rounded-lg hover:bg-gray-50 transition-colors group relative"
                                                        >
                                                            <span className="text-sm text-gray-700 group-hover:text-teal-600 flex items-center gap-1.5">
                                                                <span className="text-gray-400 text-xs absolute left-3">/</span>
                                                                <span>{subItem.name}</span>
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
                                                            {t('navigation.viewAll')} {item.title.toLowerCase()} →
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
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