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
    withHelium?: boolean;
    material?: string;
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
    colors?: string[];
    size?: string;
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
    material?: string;
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
    material?: string;
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

        // Безопасное добавление специфических полей
        if (this.isBalloon(item) || this.isBouquet(item)) {
            base.withHelium = item.withHelium
        }

        if (this.isBalloon(item)) {
            base.colors = item.colors
            base.size = item.sizes[0] // Берем первый размер
            base.material = item.material
            base.tags = item.tags
            base.occasion = item.occasion
        }

        if (this.isBouquet(item)) {
            base.balloonCount = item.balloonCount
            base.theme = item.theme
            base.includes = item.includes
            if (item.material) base.material = item.material
        }

        if (this.isCup(item)) {
            base.volume = item.volume
            base.packSize = item.packSize
            base.material = item.material
            base.theme = item.theme
            if (item.colors) base.colors = item.colors
            if (item.size) base.size = item.size
        }

        if (this.isGift(item)) {
            base.occasion = item.occasion
            if (item.material) base.material = item.material
        }

        if (this.isSet(item)) {
            base.items = item.items
            base.ageGroup = item.ageGroup
            base.gender = item.gender
            if (item.material) base.material = item.material
        }

        return base
    }

    // Type guards для безопасной проверки типов
    private static isBalloon(item: Balloon | Bouquet | Cup | Gift | Set): item is Balloon {
        return 'withHelium' in item && 'colors' in item && 'sizes' in item
    }

    private static isBouquet(item: Balloon | Bouquet | Cup | Gift | Set): item is Bouquet {
        return 'balloonCount' in item && 'theme' in item && 'includes' in item
    }

    private static isCup(item: Balloon | Bouquet | Cup | Gift | Set): item is Cup {
        return 'volume' in item && 'packSize' in item
    }

    private static isGift(item: Balloon | Bouquet | Cup | Gift | Set): item is Gift {
        return !('withHelium' in item) && !('balloonCount' in item) && !('volume' in item) && !('items' in item)
    }

    private static isSet(item: Balloon | Bouquet | Cup | Gift | Set): item is Set {
        return 'items' in item && Array.isArray((item as Set).items)
    }

    // Определяет тип продукта
    private static getProductType(item: Balloon | Bouquet | Cup | Gift | Set): ProductType {
        if (this.isBalloon(item)) {
            return item.type as ProductType
        }
        if (this.isBouquet(item)) {
            return 'bouquet'
        }
        if (this.isCup(item)) {
            return 'cup'
        }
        if (this.isSet(item)) {
            return 'set'
        }
        // Gift
        return (item as Gift).type as ProductType
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