export type ProductType =
// Шарики
    | 'foil'
    | 'latex'
    | 'led'
    | 'mini'
    // Букеты
    | 'bouquet'
    // Стаканчики
    | 'cup'
    // Подарки
    | 'plush'
    | 'souvenir'
    | 'jewelry'
    | 'sweets'
    | 'flowers'
    // Наборы
    | 'set'

// Унифицированный интерфейс для продуктов (используется в компонентах)
export interface Product {
    id: string
    name: string
    type: ProductType
    price: number
    oldPrice?: number
    discount?: number
    image: string
    category: string
    withHelium?: boolean
    size?: string
    colors?: string[]
    material?: string
    inStock: boolean
    description?: string

    // Дополнительные поля для разных типов товаров
    balloonCount?: number
    volume?: number
    packSize?: number
    theme?: string
    includes?: string[]
    tags?: string[]
    occasion?: string[]
    ageGroup?: 'baby' | 'child' | 'teen' | 'adult'
    gender?: 'boy' | 'girl' | 'unisex'
    items?: Array<{
        type: 'balloon' | 'cup' | 'gift'
        id: string
        quantity: number
    }>
}

// Детализированные интерфейсы для специфических типов товаров
export interface Balloon {
    id: string;
    name: string;
    type: 'foil' | 'latex' | 'led' | 'mini';
    material: 'фольга' | 'латекс' | 'светодиод';
    colors: string[];
    sizes: string[];
    price: number;
    oldPrice?: number;
    discount?: number;
    withHelium: boolean;
    image: string;
    category: string;
    tags: string[];
    description?: string;
    occasion?: string[];
    inStock: boolean;
}

export interface Bouquet {
    id: string;
    name: string;
    balloonCount: number;
    size: 'mini' | 'medium' | 'large' | 'huge';
    price: number;
    oldPrice?: number;
    discount?: number;
    image: string;
    category: string;
    theme: string;
    includes: string[];
    description?: string;
    inStock: boolean;
}

export interface Cup {
    id: string;
    name: string;
    material: 'plastic' | 'paper' | 'eco';
    volume: number; // in ml
    theme: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    image: string;
    category: string;
    packSize: number; // количество в упаковке
    description?: string;
    inStock: boolean;
}

export interface Gift {
    id: string;
    name: string;
    type: 'plush' | 'souvenir' | 'jewelry' | 'sweets' | 'flowers';
    price: number;
    oldPrice?: number;
    discount?: number;
    image: string;
    category: string;
    description?: string;
    occasion?: string[];
    inStock: boolean;
}

export interface Set {
    id: string;
    name: string;
    type: 'birthday' | 'romantic' | 'wedding' | 'newborn' | 'graduation' | 'custom';
    items: Array<{
        type: 'balloon' | 'cup' | 'gift';
        id: string;
        quantity: number;
    }>;
    price: number;
    oldPrice?: number;
    discount?: number;
    image: string;
    category: string;
    ageGroup?: 'baby' | 'child' | 'teen' | 'adult';
    gender?: 'boy' | 'girl' | 'unisex';
    description?: string;
    inStock: boolean;
}

// Утилиты для конвертации между типами
export class ProductConverter {
    // Конвертирует детализированный продукт в унифицированный
    static toProduct(item: Balloon | Bouquet | Cup | Gift | Set): Product {
        const base: Product = {
            id: item.id,
            name: item.name,
            price: item.price,
            oldPrice: item.oldPrice,
            discount: item.discount,
            image: item.image,
            category: item.category,
            description: item.description,
            inStock: item.inStock,
            type: this.getProductType(item)
        }

        // Добавляем специфические поля в зависимости от типа
        if ('withHelium' in item) {
            base.withHelium = item.withHelium
        }

        if ('colors' in item) {
            base.colors = item.colors
        }

        if ('sizes' in item) {
            base.size = item.sizes[0] // Берем первый размер
        }

        if ('material' in item) {
            base.material = typeof item.material === 'string' ? item.material : item.material
        }

        if ('balloonCount' in item) {
            base.balloonCount = item.balloonCount
        }

        if ('volume' in item) {
            base.volume = item.volume
        }

        if ('packSize' in item) {
            base.packSize = item.packSize
        }

        if ('theme' in item) {
            base.theme = item.theme
        }

        if ('includes' in item) {
            base.includes = item.includes
        }

        if ('tags' in item) {
            base.tags = item.tags
        }

        if ('occasion' in item) {
            base.occasion = item.occasion
        }

        if ('ageGroup' in item) {
            base.ageGroup = item.ageGroup
        }

        if ('gender' in item) {
            base.gender = item.gender
        }

        if ('items' in item) {
            base.items = item.items
        }

        return base
    }

    // Определяет тип продукта
    private static getProductType(item: Balloon | Bouquet | Cup | Gift | Set): ProductType {
        if ('withHelium' in item) {
            return item.type as ProductType // Balloon
        }
        if ('balloonCount' in item) {
            return 'bouquet'
        }
        if ('volume' in item) {
            return 'cup'
        }
        if ('items' in item) {
            return 'set'
        }
        // Gift
        return item.type as ProductType
    }

    // Конвертирует массив детализированных продуктов
    static toProductArray(items: (Balloon | Bouquet | Cup | Gift | Set)[]): Product[] {
        return items.map(item => this.toProduct(item))
    }
}

// Алиас для совместимости с существующим кодом
export interface BalloonProduct extends Product {}

// Общий тип для всех продуктов (детализированные интерфейсы)
export type DetailedProduct = Balloon | Bouquet | Cup | Gift | Set;

// Для работы с корзиной
export interface CartItem {
    product: Product;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
    withHelium?: boolean;
}

// Упрощенный тип продукта для совместимости
export interface SimpleProduct {
    id: string;
    name: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    image: string;
    category: string;
}

// Для переходного периода - совместимый интерфейс
export interface CompatibleProduct {
    id: string;
    title?: string; // старое поле
    name?: string;  // новое поле
    brand?: string; // может быть
    price: number;
    oldPrice?: number;
    discount?: number;
    image: string;
    category: string;
    link?: string;
}