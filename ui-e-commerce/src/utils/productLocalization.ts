import { Product } from '@/services/api';
import { Language } from '@/contexts/LanguageContext';

/**
 * Получает локализованное название товара на основе текущего языка
 */
export function getLocalizedProductTitle(product: Product | null | undefined, language: Language = 'uk'): string {
    if (!product) return '';

    switch (language) {
        case 'ru':
            return product.titleRu || product.title || product.name || '';
        case 'en':
            return product.titleEn || product.title || product.name || '';
        case 'uk':
        default:
            return product.titleUk || product.title || product.name || '';
    }
}

/**
 * Получает локализованное описание товара
 */
export function getLocalizedProductDescription(product: Product | null | undefined, language: Language = 'uk'): string {
    if (!product) return '';

    switch (language) {
        case 'ru':
            return product.descriptionRu || product.description || '';
        case 'en':
            return product.descriptionEn || product.description || '';
        case 'uk':
        default:
            return product.descriptionUk || product.description || '';
    }
}

