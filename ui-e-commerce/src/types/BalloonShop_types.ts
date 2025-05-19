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
}

export interface Gift {
    id: string;
    name: string;
    type: 'plush' | 'souvenirs' | 'jewelry' | 'sweets' | 'flowers';
    price: number;
    oldPrice?: number;
    discount?: number;
    image: string;
    category: string;
    description?: string;
    occasion?: string[];
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
}

// Общий тип для всех продуктов
export type BalloonProduct = Balloon | Bouquet | Cup | Gift | Set;

// Для работы с корзиной
export interface CartItem {
    product: BalloonProduct;
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