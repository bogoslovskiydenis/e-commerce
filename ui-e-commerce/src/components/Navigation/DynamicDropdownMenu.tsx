'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Category, Product, apiService } from '@/services/api'

interface DynamicDropdownMenuProps {
    categoryType: string;
    categoryId: string;
    children?: Category[];
}

export function DynamicDropdownMenu({ categoryType, categoryId, children }: DynamicDropdownMenuProps) {
    const [subcategories, setSubcategories] = useState<Category[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDropdownData();
    }, [categoryType, categoryId]);

    const loadDropdownData = async () => {
        try {
            setIsLoading(true);

            // Используем переданные дочерние категории или загружаем из API
            let categories: Category[] = [];
            if (children && children.length > 0) {
                categories = children;
            } else {
                categories = await apiService.getCategoriesByType(categoryType);
            }

            setSubcategories(categories);

            // Загружаем рекомендуемые товары для этой категории
            if (categories.length > 0) {
                const products = await apiService.getFeaturedProducts(4);
                // Фильтруем товары по типу категории если нужно
                const filteredProducts = products.filter(product =>
                    product.category?.type === categoryType ||
                    product.categoryId === categoryId
                );
                setFeaturedProducts(filteredProducts.slice(0, 4));
            }
        } catch (error) {
            console.error('Error loading dropdown data:', error);
            setSubcategories([]);
            setFeaturedProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const getCategoryIcon = (type: string) => {
        const icons: Record<string, string> = {
            'balloons': '🎈',
            'bouquets': '💐',
            'gifts': '🎁',
            'cups': '🥤',
            'sets': '📦',
            'events': '🎉',
            'occasions': '✨',
            'colors': '🌈',
            'materials': '🏷️'
        };
        return icons[type] || '📂';
    };

    if (isLoading) {
        return (
            <div className="p-4 w-96">
                <div className="animate-pulse">
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded"></div>
                        </div>
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-20 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dropdown-content p-6 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Подкategории */}
                {subcategories.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                            {getCategoryIcon(categoryType)}
                            <span className="ml-2">Категории</span>
                        </h3>
                        <ul className="space-y-2">
                            {subcategories.slice(0, 8).map((category) => (
                                <li key={category.id}>
                                    <Link
                                        href={category.href || `/${category.slug}`}
                                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                    >
                                        <span className="text-sm text-gray-700 group-hover:text-teal-600">
                                            {category.name}
                                        </span>
                                        {category.productsCount > 0 && (
                                            <span className="text-xs text-gray-400">
                                                {category.productsCount}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {subcategories.length > 8 && (
                            <Link
                                href={`/${categoryType}`}
                                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                            >
                                Смотреть все →
                            </Link>
                        )}
                    </div>
                )}

                {/* Рекомендуемые товары */}
                {featuredProducts.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                            ⭐ <span className="ml-2">Популярные</span>
                        </h3>
                        <div className="space-y-3">
                            {featuredProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.slug}`}
                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                                >
                                    {product.imageUrl && (
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 group-hover:text-teal-600 truncate">
                                            {product.name}
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-semibold text-teal-600">
                                                {product.price}₴
                                            </span>
                                            {product.oldPrice && (
                                                <span className="text-xs text-gray-400 line-through">
                                                    {product.oldPrice}₴
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Специальные предложения */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        🔥 <span className="ml-2">Акции</span>
                    </h3>
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-100">
                        <div className="text-sm font-semibold text-red-600 mb-1">
                            Скидка до 30%
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                            На весь ассортимент {getCategoryName(categoryType)}
                        </div>
                        <Link
                            href={`/sale?category=${categoryType}`}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                            Подробнее →
                        </Link>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4 border border-blue-100">
                        <div className="text-sm font-semibold text-teal-600 mb-1">
                            Бесплатная доставка
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                            При заказе от 500₴
                        </div>
                        <Link
                            href="/delivery"
                            className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                        >
                            Условия →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Быстрые действия */}
            <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                    <Link
                        href={`/${categoryType}`}
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                    >
                        Посмотреть все {getCategoryName(categoryType).toLowerCase()}
                    </Link>
                    <div className="flex space-x-3 text-xs text-gray-500">
                        <Link href="/compare" className="hover:text-gray-700">
                            Сравнить
                        </Link>
                        <Link href="/wishlist" className="hover:text-gray-700">
                            Избранное
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Вспомогательная функция для получения названия категории
function getCategoryName(type: string): string {
    const names: Record<string, string> = {
        'balloons': 'Шарики',
        'bouquets': 'Букеты',
        'gifts': 'Подарки',
        'cups': 'Стаканчики',
        'sets': 'Наборы',
        'events': 'События',
        'occasions': 'Поводы'
    };
    return names[type] || 'Товары';
}