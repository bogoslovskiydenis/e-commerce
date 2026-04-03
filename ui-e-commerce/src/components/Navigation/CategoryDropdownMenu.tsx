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
    onLinkClick?: () => void;
}

interface SubcategoryGroup {
    title: string;
    items: Category[];
}

export function CategoryDropdownMenu({ categoryId, categoryName, children, onLinkClick }: CategoryDropdownMenuProps) {
    const { language } = useTranslation();
    const [subcategoryGroups, setSubcategoryGroups] = useState<SubcategoryGroup[]>([]);
    const [promoCards, setPromoCards] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [categoryId, children, language]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [cards] = await Promise.all([
                apiService.getNavPromoCards(categoryId),
            ]);
            setPromoCards(cards);

            let allSubcategories: Category[] = [];
            if (children && children.length > 0) {
                allSubcategories = children;
            } else {
                const categories = await apiService.getNavigationCategories();
                const current = categories.find(cat => cat.id === categoryId);
                if (current?.children) allSubcategories = current.children;
            }

            setSubcategoryGroups(organizeSubcategories(allSubcategories));
        } catch {
            setSubcategoryGroups([]);
        } finally {
            setIsLoading(false);
        }
    };

    const organizeSubcategories = (subcategories: Category[]): SubcategoryGroup[] => {
        if (subcategories.length === 0) return [];

        const sorted = [...subcategories].sort((a, b) => {
            return ((a as any).sortOrder || a.order || 0) - ((b as any).sortOrder || b.order || 0);
        });

        const groupMap = new Map<string, Category[]>();
        const itemsPerColumn = Math.ceil(sorted.length / 3);

        sorted.forEach((sub, index) => {
            const desc = sub.description || '';
            let groupTitle = '';
            if (desc.includes('Группа:') || desc.includes('Група:')) {
                const match = desc.match(/(?:Группа|Група):\s*([^\n,]+)/i);
                if (match) groupTitle = match[1].trim();
            }
            if (!groupTitle) {
                groupTitle = `col_${Math.floor(index / itemsPerColumn)}`;
            }
            if (!groupMap.has(groupTitle)) groupMap.set(groupTitle, []);
            groupMap.get(groupTitle)!.push(sub);
        });

        const groups: SubcategoryGroup[] = [];
        groupMap.forEach((items, title) => {
            items.sort((a, b) => ((a as any).sortOrder || a.order || 0) - ((b as any).sortOrder || b.order || 0));
            groups.push({ title: title.startsWith('col_') ? '' : title, items });
        });

        groups.sort((a, b) => {
            return ((a.items[0] as any)?.sortOrder || a.items[0]?.order || 0) -
                   ((b.items[0] as any)?.sortOrder || b.items[0]?.order || 0);
        });

        return groups;
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="flex gap-8 animate-pulse">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex-1 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            {[1,2,3,4,5].map(j => <div key={j} className="h-3 bg-gray-100 rounded" />)}
                        </div>
                    ))}
                    {[1, 2].map(i => (
                        <div key={i} className="w-44 space-y-2">
                            <div className="h-32 bg-gray-200 rounded" />
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-100 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (subcategoryGroups.length === 0 && promoCards.length === 0) return null;

    const themeMap: Record<string, { link: string }> = {
        teal:   { link: 'text-teal-600 hover:text-teal-700' },
        pink:   { link: 'text-pink-500 hover:text-pink-600' },
        purple: { link: 'text-purple-600 hover:text-purple-700' },
        orange: { link: 'text-orange-500 hover:text-orange-600' },
    };

    return (
        <div className="container mx-auto py-7 px-4">
            <div className="flex gap-8">
                {/* Колонки подкатегорий */}
                <div className="flex gap-10 flex-1">
                    {subcategoryGroups.map((group, gi) => (
                        <div key={gi} className="min-w-[140px]">
                            {group.title && (
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                    {group.title}
                                </p>
                            )}
                            <ul className="space-y-[10px]">
                                {group.items.map((sub) => (
                                    <li key={sub.id}>
                                        <Link
                                            href={`/${sub.slug}`}
                                            className="text-sm text-gray-700 hover:text-teal-600 transition-colors"
                                            onClick={onLinkClick}
                                        >
                                            {getLocalizedCategoryName(sub, language)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            {gi === 0 && (
                                <Link
                                    href={`/${categoryId}`}
                                    className="block mt-5 text-sm font-medium text-gray-500 hover:text-teal-600 transition-colors"
                                    onClick={onLinkClick}
                                >
                                    Показати все →
                                </Link>
                            )}
                        </div>
                    ))}
                </div>

                {/* Промо-карточки */}
                {promoCards.length > 0 && (
                    <div className="flex gap-4 shrink-0">
                        {promoCards.map((card) => {
                            const theme = card.colorTheme || 'teal';
                            const cls = themeMap[theme] || themeMap.teal;
                            const title = language === 'uk' ? (card.titleUk || card.title)
                                        : language === 'ru' ? (card.titleRu || card.title)
                                        : card.title;
                            const subtitle = language === 'uk' ? (card.subtitleUk || card.subtitle)
                                           : language === 'ru' ? (card.subtitleRu || card.subtitle)
                                           : card.subtitle;
                            const linkText = language === 'uk' ? (card.linkTextUk || card.linkText)
                                           : language === 'ru' ? (card.linkTextRu || card.linkText)
                                           : card.linkText;
                            return (
                                <Link
                                    key={card.id}
                                    href={card.link}
                                    className="group w-44 shrink-0 block"
                                    onClick={onLinkClick}
                                >
                                    <div className="w-full h-36 bg-gray-100 rounded-lg overflow-hidden mb-3 relative">
                                        {card.imageUrl ? (
                                            <Image
                                                src={card.imageUrl.startsWith('http') ? card.imageUrl : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'}${card.imageUrl}`}
                                                alt={title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-50">
                                                {card.emoji || '🎁'}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 mb-1">{subtitle}</p>
                                    <p className="text-sm font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                                        {title}
                                    </p>
                                    <span className={`text-xs font-medium ${cls.link} transition-colors`}>
                                        {linkText || 'Переглянути товари →'}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Нижняя ссылка */}
        </div>
    );
}
