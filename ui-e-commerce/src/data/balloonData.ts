import type { CompatibleProduct } from '@/types/BalloonShop_types'

// Продукты для главной страницы - совместимый формат
export const FEATURED_PRODUCTS: CompatibleProduct[] = [
    {
        id: '1',
        name: 'Сердце фольгированное красное',
        price: 150,
        oldPrice: 200,
        discount: 25,
        image: '/images/hard.jpg',
        category: 'hearts',
        link: '/products/hearts/1'
    },
    {
        id: '2',
        name: 'Букет "С днем рождения"',
        price: 450,
        image: '/api/placeholder/300/300',
        category: 'bouquets',
        link: '/products/bouquets/2'
    },
    {
        id: '3',
        name: 'Цифра "1" золотая',
        price: 350,
        oldPrice: 400,
        discount: 12,
        image: '/api/placeholder/300/300',
        category: 'numbers',
        link: '/products/numbers/3'
    },
    {
        id: '4',
        name: 'Набор "Единорог"',
        price: 650,
        oldPrice: 750,
        discount: 13,
        image: '/api/placeholder/300/300',
        category: 'sets',
        link: '/products/sets/4'
    }
]

// Категории для главной страницы
export const MAIN_CATEGORIES = [
    {
        name: 'Фольгированные шары',
        image: '/images/hard.jpg',
        href: '/balloons/foil',
        count: '200+'
    },
    {
        name: 'Букеты из шаров',
        image: '/api/placeholder/400/400',
        href: '/bouquets',
        count: '150+'
    },
    {
        name: 'День рождения',
        image: '/api/placeholder/400/400',
        href: '/sets/birthday',
        count: '100+'
    },
    {
        name: 'Свадебные',
        image: '/api/placeholder/400/400',
        href: '/balloons/wedding',
        count: '80+'
    },
    {
        name: 'Детские наборы',
        image: '/api/placeholder/400/400',
        href: '/sets/kids',
        count: '120+'
    }
]

// Отзывы
export const REVIEWS = [
    {
        name: 'Анна',
        text: 'Заказывала букет на день рождения дочки. Все очень красиво и качественно! Доставили точно в срок.',
        rating: 5
    },
    {
        name: 'Дмитрий',
        text: 'Отличный сервис! Быстро оформили заказ, привезли шарики для корпоратива. Все остались довольны.',
        rating: 5
    },
    {
        name: 'Елена',
        text: 'Красивые фольгированные шары для свадьбы. Качество отличное, продержались весь день!',
        rating: 5
    }
]