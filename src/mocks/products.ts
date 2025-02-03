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
        category: 'dresses',
        link: '/products/dresses/w1'
    },
    {
        id: 'w2',
        title: 'Блуза · Білий',
        brand: 'H&M',
        price: 1299,
        oldPrice: null,
        discount: 0,
        image: '/images/products/women/2.jpg',
        category: 'tops',
        link: '/products/tops/w2'
    },
    {
        id: 'w3',
        title: 'Джинси · Синій',
        brand: 'Levi\'s',
        price: 2899,
        oldPrice: null,
        discount: 0,
        image: '/images/products/women/3.jpg',
        category: 'jeans',
        link: '/products/jeans/w3'
    }
]

export const MEN_PRODUCTS: Product[] = [
    {
        id: 'm1',
        title: 'Піджак · Чорний',
        brand: 'Hugo Boss',
        price: 4599,
        oldPrice: 5999,
        discount: 23,
        image: '/images/products/men/1.jpg',
        category: 'jackets',
        link: '/products/jackets/m1'
    },
    {
        id: 'm2',
        title: 'Джинси · Темно-синій',
        brand: 'Levi\'s',
        price: 2899,
        oldPrice: null,
        discount: 0,
        image: '/images/products/men/2.jpg',
        category: 'jeans',
        link: '/products/jeans/m2'
    },
    {
        id: 'm3',
        title: 'Светр · Сірий',
        brand: 'Tommy Hilfiger',
        price: 3299,
        oldPrice: null,
        discount: 0,
        image: '/images/products/men/3.jpg',
        category: 'sweaters',
        link: '/products/sweaters/m3'
    }
]