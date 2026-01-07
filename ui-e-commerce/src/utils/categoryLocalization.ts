import { Category } from '@/services/api';
import { Language } from '@/contexts/LanguageContext';

/**
 * Получает локализованное имя категории на основе текущего языка
 */
export function getLocalizedCategoryName(category: Category | null | undefined, language: Language = 'uk'): string {
    if (!category) return '';

    switch (language) {
        case 'ru':
            return category.nameRu || category.name || '';
        case 'en':
            return category.nameEn || category.name || '';
        case 'uk':
        default:
            return category.nameUk || category.name || '';
    }
}

/**
 * Получает локализованное описание категории
 */
export function getLocalizedCategoryDescription(category: Category | null | undefined, language: Language = 'uk'): string {
    if (!category) return '';

    switch (language) {
        case 'ru':
            return category.descriptionRu || category.description || '';
        case 'en':
            return category.descriptionEn || category.description || '';
        case 'uk':
        default:
            return category.descriptionUk || category.description || '';
    }
}

