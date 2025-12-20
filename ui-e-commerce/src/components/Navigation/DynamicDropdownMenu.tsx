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
                // ИСПРАВЛЕНО: теперь этот метод существует в apiService
                categories = await apiService.getCategoriesByType(categoryType);
            }

            setSubcategories(categories);

            // Загружаем рекомендуемые товары для этой категории
            if (categories.length > 0 || categoryId) {
                const products = await apiService.getFeaturedProducts(4);
                // Фильтруем товары по типу категории если нужно
                const filteredProducts = products.filter(product => {
                    if (product.categoryId === categoryId) return true;
                    if (product.category === categoryType) return true;
                    return false;
                });
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

    const getCategoryIcon = (type: string): string => {
        const icons: Record<string, string> = {
            'balloons': '🎈',
            'bouquets': '💐',
            'gifts': '🎁',
            'cups': '🥤',
            'sets': '📦',
            'events': '🎉',
            'occasions': '✨',
            'colors': '🌈',
            'materials': '🏷️',
            'promotions': '🔥'
        };
        return icons[type] || '📂';
    };

    if (isLoading) {
        return (
            <div className="p-4 w-96">
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    // Если нет подкатегорий и товаров - не показываем меню
    if (subcategories.length === 0 && featuredProducts.length === 0) {
        return null;
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[400px] max-w-[600px]">
            <div className="grid grid-cols-2 gap-4">
                {/* Колонка с подкатегориями */}
                {subcategories.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span>{getCategoryIcon(categoryType)}</span>
                            <span>Категории</span>
                        </h3>
                        <div className="space-y-1">
                            {subcategories.map((subcategory) => (
                                <Link
                                    key={subcategory.id}
                                    href={`/${subcategory.slug}`}
                                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 rounded-md transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{subcategory.name}</span>
                                        {subcategory.productsCount !== undefined && subcategory.productsCount > 0 && (
                                            <span className="text-xs text-gray-400">
                                                ({subcategory.productsCount})
                                            </span>
                                        )}
                                    </div>
                                    {subcategory.description && (
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                            {subcategory.description}
                                        </p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Колонка с рекомендуемыми товарами */}
                {featuredProducts.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">
                            Популярные товары
                        </h3>
                        <div className="space-y-3">
                            {featuredProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.id}`}
                                    className="block group"
                                >
                                    <div className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                        {/* Миниатюра товара */}
                                        <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                            {product.image ? (
                                                <Image
                                                    src={product.image}
                                                    alt={product.title || product.name || 'Product'}
                                                    fill
                                                    sizes="64px"
                                                    className="object-cover group-hover:scale-110 transition-transform duration-200"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                                                    🎈
                                                </div>
                                            )}
                                        </div>

                                        {/* Информация о товаре */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-teal-600 line-clamp-2 transition-colors">
                                                {product.title || product.name}
                                            </h4>
                                            <div className="mt-1 flex items-center gap-2">
                                                <span className="text-sm font-semibold text-teal-600">
                                                    {product.price} грн
                                                </span>
                                                {product.oldPrice && (
                                                    <span className="text-xs text-gray-400 line-through">
                                                        {product.oldPrice} грн
                                                    </span>
                                                )}
                                            </div>
                                            {product.discount && product.discount > 0 && (
                                                <span className="inline-block mt-1 text-xs font-medium text-red-600">
                                                    -{product.discount}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Ссылка "Смотреть все" */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                    href={`/categories/${categoryId}`}
                    className="block text-center text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                >
                    Смотреть все товары →
                </Link>
            </div>
        </div>
    );
}