'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Category, apiService } from '@/services/api'
import { DynamicDropdownMenu } from './DynamicDropdownMenu'
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
    type: string;
    order: number;
    children?: Category[];
}

export default function DynamicNavigation() {
    const { language, t } = useTranslation();
    const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Загрузка категорий из админ панели
    useEffect(() => {
        loadNavigationData();
    }, [language]);

    const loadNavigationData = async () => {
        try {
            setIsLoading(true);
            const categories = await apiService.getNavigationCategories();

            // Преобразуем категории в элементы навигации (только родительские категории)
            const items = categories.map(category => ({
                id: category.id,
                title: getLocalizedCategoryName(category, language),
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
                    title: t('navigation.sale'),
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
        } finally {
            setIsLoading(false);
        }
    };

    const handleMouseEnter = (itemId: string) => {
        setHoveredItem(itemId);
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
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
                                    <div className="nav-dropdown" style={{ width: 'max-content', minWidth: '900px', left: '0', right: 'auto' }}>
                                        {/* Динамический dropdown меню для категорий с подкатегориями */}
                                        {(item.children && item.children.length > 0) ? (
                                            <CategoryDropdownMenu
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