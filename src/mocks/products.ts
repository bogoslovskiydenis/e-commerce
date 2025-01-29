import { Product } from '@/types'

export const WOMEN_PRODUCTS: Product[] = [
    {
        id: 'w1',
        title: 'Платье · Чорний',
        brand: 'Zara',
        price: 2199,
        oldPrice: 2899,
        discount: 24,
        image: '/images/products/women/1.jpg',
        category: 'dresses'
    },
    {
        id: 'w2',
        title: 'Блуза · Білий',
        brand: 'H&M',
        price: 1299,
        image: '/images/products/women/2.jpg',
        category: 'tops'
    },
    {
        id: 'w3',
        title: 'Джинси · Синій',
        brand: 'Levi\'s',
        price: 2899,
        image: '/images/products/women/3.jpg',
        category: 'jeans'
    }
]

export const MEN_PRODUCTS: Product[] = [
    // Добавьте моковые данные для мужской категории
]