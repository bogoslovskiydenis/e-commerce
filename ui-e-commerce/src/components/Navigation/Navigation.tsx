'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [navBottom, setNavBottom] = useState(0);
    const navBarRef = useRef<HTMLElement>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { categories, isLoading, error } = useNavigation();

    const openItem = useCallback((id: string) => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        if (navBarRef.current) {
            setNavBottom(navBarRef.current.getBoundingClientRect().bottom);
        }
        setActiveItem(id);
    }, []);

    const scheduleClose = useCallback(() => {
        closeTimer.current = setTimeout(() => setActiveItem(null), 150);
    }, []);

    const cancelClose = useCallback(() => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
    }, []);

    const closeNow = useCallback(() => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setActiveItem(null);
    }, []);

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
            {activeItem && (
                <div
                    className="fixed left-0 right-0 bottom-0 bg-black/40 z-40"
                    style={{ top: navBottom }}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                    onClick={closeNow}
                />
            )}

            <nav ref={navBarRef} className="bg-white border-t border-b relative z-50">
                <div className="container mx-auto">
                    <ul className="flex">
                        {navigationItems.map((item) => (
                            <li
                                key={item.id}
                                className="nav-item"
                                style={{ background: activeItem === item.id ? '#f3f4f6' : 'transparent' }}
                                onMouseEnter={() => item.hasDropdown ? openItem(item.id) : undefined}
                                onMouseLeave={() => item.hasDropdown ? scheduleClose() : undefined}
                            >
                                <Link
                                    href={item.href}
                                    className={`nav-link flex items-center gap-1 px-6 py-4 text-sm transition-colors ${
                                        item.isSpecial
                                            ? 'text-red-600 font-semibold hover:text-red-700'
                                            : activeItem === item.id
                                                ? 'text-teal-600 font-medium'
                                                : 'text-gray-900 hover:text-teal-600'
                                    }`}
                                    onClick={closeNow}
                                >
                                    {item.title}
                                    {item.hasDropdown && (
                                        <svg
                                            width="10" height="6"
                                            viewBox="0 0 10 6"
                                            className={`transition-transform duration-200 ${activeItem === item.id ? 'rotate-180' : ''}`}
                                            fill="none"
                                        >
                                            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                </Link>

                                {item.hasDropdown && activeItem === item.id && (
                                    <div
                                        className="fixed left-0 right-0 z-50 bg-white shadow-xl border-t border-gray-100"
                                        style={{ top: navBottom }}
                                        onMouseEnter={cancelClose}
                                        onMouseLeave={scheduleClose}
                                    >
                                        {(item.children && item.children.length > 0) ? (
                                            <CategoryDropdownMenu
                                                categoryId={item.id}
                                                categoryName={item.title}
                                                children={item.children}
                                                onLinkClick={closeNow}
                                            />
                                        ) : (
                                            <div className="container mx-auto py-6 px-4">
                                                <div className="space-y-2">
                                                    <h3 className="font-semibold text-gray-900 mb-3">{item.title}</h3>
                                                    {getDropdownContent(item).map((subItem: any, index: number) => (
                                                        <Link
                                                            key={index}
                                                            href={subItem.href}
                                                            className="block text-sm text-gray-600 hover:text-teal-600 py-1"
                                                            onClick={closeNow}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    ))}
                                                    <Link href={item.href} className="text-sm text-teal-600 hover:text-teal-700 font-medium pt-2 block" onClick={closeNow}>
                                                        {t('navigation.viewAll')} {item.title.toLowerCase()} →
                                                    </Link>
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