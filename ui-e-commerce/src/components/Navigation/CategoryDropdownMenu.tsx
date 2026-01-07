'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Category, apiService } from '@/services/api'
import { useTranslation } from '@/contexts/LanguageContext'
import { getLocalizedCategoryName } from '@/utils/categoryLocalization'

interface CategoryDropdownMenuProps {
    categoryId: string;
    categoryName: string;
    children?: Category[];
}

interface SubcategoryGroup {
    title: string;
    items: Category[];
}

export function CategoryDropdownMenu({ categoryId, categoryName, children }: CategoryDropdownMenuProps) {
    const { language } = useTranslation();
    const [subcategoryGroups, setSubcategoryGroups] = useState<SubcategoryGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSubcategories();
    }, [categoryId, children, language]);

    const loadSubcategories = async () => {
        try {
            setIsLoading(true);

            let allSubcategories: Category[] = [];

            // Используем переданные дочерние категории или загружаем из API
            if (children && children.length > 0) {
                allSubcategories = children;
            } else {
                // Загружаем все подкатегории для текущей категории
                const categories = await apiService.getNavigationCategories();
                const currentCategory = categories.find(cat => cat.id === categoryId);
                if (currentCategory?.children) {
                    allSubcategories = currentCategory.children;
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

    // Организуем подкатегории в группы (колонки) на основе sortOrder из админки
    const organizeSubcategories = (subcategories: Category[]): SubcategoryGroup[] => {
        if (subcategories.length === 0) {
            return [];
        }

        // Сортируем подкатегории по sortOrder (из админки)
        const sorted = [...subcategories].sort((a, b) => {
            const orderA = (a as any).sortOrder || a.order || 0;
            const orderB = (b as any).sortOrder || b.order || 0;
            return orderA - orderB;
        });

        // Группируем по диапазонам sortOrder для создания колонок
        // Используем поле description или filters для указания названия группы, если есть
        // Иначе группируем равномерно по 3-4 колонки
        const groups: SubcategoryGroup[] = [];
        const itemsPerColumn = Math.ceil(sorted.length / 3); // Максимум 3 колонки

        // Пытаемся определить группы по описанию или другим полям
        const groupMap = new Map<string, Category[]>();
        
        sorted.forEach((sub, index) => {
            // Используем description для указания группы, если оно содержит название группы
            const desc = sub.description || '';
            let groupTitle = '';
            
            // Проверяем, есть ли в description указание на группу (например, "Группа: Популярні")
            if (desc.includes('Группа:') || desc.includes('Група:')) {
                const match = desc.match(/(?:Группа|Група):\s*([^\n,]+)/i);
                if (match) {
                    groupTitle = match[1].trim();
                }
            }
            
            // Если группа не указана, используем автоматическую группировку по sortOrder
            if (!groupTitle) {
                // Определяем номер колонки на основе индекса
                const columnIndex = Math.floor(index / itemsPerColumn);
                groupTitle = `Колонка ${columnIndex + 1}`;
            }
            
            if (!groupMap.has(groupTitle)) {
                groupMap.set(groupTitle, []);
            }
            groupMap.get(groupTitle)!.push(sub);
        });

        // Преобразуем Map в массив групп
        groupMap.forEach((items, title) => {
            // Сортируем элементы внутри группы по sortOrder
            items.sort((a, b) => {
                const orderA = (a as any).sortOrder || a.order || 0;
                const orderB = (b as any).sortOrder || b.order || 0;
                return orderA - orderB;
            });
            
            groups.push({
                title: title,
                items: items
            });
        });

        // Если групп нет или слишком много, группируем равномерно
        if (groups.length === 0 || groups.length > 4) {
            groups.length = 0; // Очищаем
            const chunkSize = Math.ceil(sorted.length / 3);
            for (let i = 0; i < sorted.length; i += chunkSize) {
                const chunk = sorted.slice(i, i + chunkSize);
                if (chunk.length > 0) {
                    groups.push({
                        title: i === 0 ? 'Популярні' : i === chunkSize ? 'Преміум' : 'Інші',
                        items: chunk
                    });
                }
            }
        }

        // Сортируем группы по порядку появления первой категории в группе
        groups.sort((a, b) => {
            const orderA = (a.items[0] as any)?.sortOrder || a.items[0]?.order || 0;
            const orderB = (b.items[0] as any)?.sortOrder || b.items[0]?.order || 0;
            return orderA - orderB;
        });

        return groups;
    };

    if (isLoading) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 w-full" style={{ minWidth: '900px', maxWidth: '1200px' }}>
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5].map(i => (
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
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-6 w-full" style={{ minWidth: '900px', maxWidth: '1200px' }}>
            <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900">{categoryName}</h2>
            </div>

            <div className="grid grid-cols-5 gap-6">
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
                                            <span>{getLocalizedCategoryName(subcategory, language)}</span>
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
                        {groupIndex === 0 && group.items.length > 0 && (
                            <Link
                                href={`/${categoryId === 'balloons' ? 'balloons' : categoryId}`}
                                className="block mt-4 text-sm text-gray-600 hover:text-teal-600 font-medium"
                            >
                                Показати все →
                            </Link>
                        )}
                    </div>
                ))}

                {/* Промо-карточки справа (если есть место) - можно настроить через админку */}
                {subcategoryGroups.length < 5 && (
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
                                href={`/${categoryId === 'balloons' ? 'balloons' : categoryId}/special`}
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
                                href={`/${categoryId === 'balloons' ? 'balloons' : categoryId}/gift-sets`}
                                className="text-xs font-medium text-pink-600 hover:text-pink-700"
                            >
                                Переглянути товари →
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Ссылка "Смотреть все" внизу */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <Link
                    href={`/${categoryId === 'balloons' ? 'balloons' : categoryId}`}
                    className="flex items-center justify-center text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                >
                    Смотреть все {categoryName.toLowerCase()} →
                </Link>
            </div>
        </div>
    );
}
