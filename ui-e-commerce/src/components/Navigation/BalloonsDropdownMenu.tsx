'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Category, apiService } from '@/services/api'

interface BalloonsDropdownMenuProps {
    categoryId: string;
    categoryName: string;
    children?: Category[];
}

interface SubcategoryGroup {
    title: string;
    items: Category[];
}

export function BalloonsDropdownMenu({ categoryId, categoryName, children }: BalloonsDropdownMenuProps) {
    const [subcategoryGroups, setSubcategoryGroups] = useState<SubcategoryGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSubcategories();
    }, [categoryId, children]);

    const loadSubcategories = async () => {
        try {
            setIsLoading(true);

            let allSubcategories: Category[] = [];

            // Используем переданные дочерние категории или загружаем из API
            if (children && children.length > 0) {
                allSubcategories = children;
            } else {
                // Загружаем все подкатегории для категории "Шарики"
                const categories = await apiService.getNavigationCategories();
                const balloonsCategory = categories.find(cat => 
                    cat.slug === 'balloons' || cat.name.toLowerCase().includes('шарик')
                );
                if (balloonsCategory?.children) {
                    allSubcategories = balloonsCategory.children;
                }
            }

            // Группируем подкатегории по типам/группам
            const groups = organizeSubcategories(allSubcategories);
            setSubcategoryGroups(groups);
        } catch (error) {
            console.error('Error loading balloons subcategories:', error);
            setSubcategoryGroups([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Организуем подкатегории в группы (колонки)
    const organizeSubcategories = (subcategories: Category[]): SubcategoryGroup[] => {
        const groups: SubcategoryGroup[] = [];

        // Группа 1: Популярные типы шаров
        const popularTypes = subcategories.filter(sub => {
            const name = sub.name.toLowerCase();
            return name.includes('фольг') || 
                   name.includes('латекс') || 
                   name.includes('гелиев') ||
                   name.includes('обычн');
        });
        if (popularTypes.length > 0) {
            groups.push({
                title: 'Популярні типи',
                items: popularTypes
            });
        }

        // Группа 2: По размерам
        const bySize = subcategories.filter(sub => {
            const name = sub.name.toLowerCase();
            return name.includes('размер') || 
                   name.includes('размір') ||
                   name.includes('см') ||
                   name.includes('дюйм');
        });
        if (bySize.length > 0) {
            groups.push({
                title: 'За розміром',
                items: bySize
            });
        }

        // Группа 3: По форме
        const byShape = subcategories.filter(sub => {
            const name = sub.name.toLowerCase();
            return name.includes('сердц') || 
                   name.includes('серце') ||
                   name.includes('кругл') ||
                   name.includes('зірк') ||
                   name.includes('звезд');
        });
        if (byShape.length > 0) {
            groups.push({
                title: 'За формою',
                items: byShape
            });
        }

        // Группа 4: По поводу/событию
        const byOccasion = subcategories.filter(sub => {
            const name = sub.name.toLowerCase();
            return name.includes('день рожд') || 
                   name.includes('свадьб') ||
                   name.includes('ювілей') ||
                   name.includes('юбилей') ||
                   name.includes('новый год') ||
                   name.includes('новий рік');
        });
        if (byOccasion.length > 0) {
            groups.push({
                title: 'За подією',
                items: byOccasion
            });
        }

        // Если не удалось сгруппировать, создаем общую группу
        if (groups.length === 0 && subcategories.length > 0) {
            // Разделяем на 2-3 колонки равномерно
            const chunkSize = Math.ceil(subcategories.length / 3);
            for (let i = 0; i < subcategories.length; i += chunkSize) {
                groups.push({
                    title: i === 0 ? 'Популярні' : i === chunkSize ? 'Преміум' : 'Інші',
                    items: subcategories.slice(i, i + chunkSize)
                });
            }
        }

        // Если все еще нет групп, просто разделяем на колонки
        if (groups.length === 0) {
            const chunkSize = Math.ceil(subcategories.length / 3);
            for (let i = 0; i < subcategories.length; i += chunkSize) {
                groups.push({
                    title: `Колонка ${Math.floor(i / chunkSize) + 1}`,
                    items: subcategories.slice(i, i + chunkSize)
                });
            }
        }

        return groups;
    };

    if (isLoading) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 w-full max-w-6xl">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (subcategoryGroups.length === 0) {
        return null;
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-6 w-full max-w-6xl">
            <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900">{categoryName}</h2>
            </div>

            <div className="grid grid-cols-4 gap-6">
                {/* Колонки с подкатегориями */}
                {subcategoryGroups.map((group, groupIndex) => (
                    <div 
                        key={groupIndex} 
                        className={groupIndex < subcategoryGroups.length - 1 ? 'border-r border-gray-200 pr-6' : ''}
                    >
                        <h3 className="font-semibold text-gray-900 mb-4 text-sm">
                            {group.title}
                        </h3>
                        <ul className="space-y-2">
                            {group.items.map((subcategory) => (
                                <li key={subcategory.id}>
                                    <Link
                                        href={`/${subcategory.slug}`}
                                        className="block text-sm text-gray-600 hover:text-teal-600 transition-colors py-1"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{subcategory.name}</span>
                                            {subcategory.productsCount !== undefined && subcategory.productsCount > 0 && (
                                                <span className="text-xs text-gray-400 ml-2">
                                                    {subcategory.productsCount}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {groupIndex === 0 && (
                            <Link
                                href={`/${categoryId === 'balloons' ? 'balloons' : categoryId}`}
                                className="block mt-4 text-sm text-gray-600 hover:text-teal-600 font-medium"
                            >
                                Показати все →
                            </Link>
                        )}
                    </div>
                ))}

                {/* Промо-карточки справа (если есть место) */}
                {subcategoryGroups.length < 4 && (
                    <div className="space-y-4">
                        {/* Промо-карточка 1 */}
                        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 border border-teal-200">
                            <div className="aspect-square bg-white rounded-md mb-3 flex items-center justify-center">
                                <span className="text-4xl">🎈</span>
                            </div>
                            <h4 className="font-semibold text-sm text-gray-900 mb-1">
                                Спеціальні пропозиції
                            </h4>
                            <p className="text-xs text-gray-600 mb-3">
                                Унікальні композиції
                            </p>
                            <Link
                                href="/balloons/special"
                                className="text-xs font-medium text-teal-600 hover:text-teal-700"
                            >
                                Переглянути товари →
                            </Link>
                        </div>

                        {/* Промо-карточка 2 */}
                        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200">
                            <div className="aspect-square bg-white rounded-md mb-3 flex items-center justify-center">
                                <span className="text-4xl">💝</span>
                            </div>
                            <h4 className="font-semibold text-sm text-gray-900 mb-1">
                                Подарункові набори
                            </h4>
                            <p className="text-xs text-gray-600 mb-3">
                                Готові композиції
                            </p>
                            <Link
                                href="/balloons/gift-sets"
                                className="text-xs font-medium text-pink-600 hover:text-pink-700"
                            >
                                Переглянути товари →
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Ссылка "Смотреть все шарики" внизу */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <Link
                    href="/balloons"
                    className="flex items-center justify-center text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                >
                    Смотреть все шарики →
                </Link>
            </div>
        </div>
    );
}
