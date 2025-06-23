export const PRODUCTS_DATA = {
    balloons: [
        {
            id: '1',
            name: 'Сердце фольгированное красное',
            type: 'foil' as const,
            price: 150,
            oldPrice: 200,
            discount: 25,
            image: '/images/hard.jpg',
            category: 'hearts',
            withHelium: true,
            size: '45см',
            colors: ['Красный'],
            material: 'Фольга',
            inStock: true
        },
        {
            id: '2',
            name: 'Звезда золотая',
            type: 'foil' as const,
            price: 120,
            image: '/images/hard.jpg',
            category: 'stars',
            withHelium: true,
            size: '50см',
            colors: ['Золотой'],
            material: 'Фольга',
            inStock: true
        },
        {
            id: '3',
            name: 'Цифра "1" серебряная',
            type: 'foil' as const,
            price: 350,
            oldPrice: 400,
            discount: 12,
            image: '/api/placeholder/300/300',
            category: 'numbers',
            withHelium: true,
            size: '90см',
            colors: ['Серебряный'],
            material: 'Фольга',
            inStock: true
        },
        {
            id: '4',
            name: 'Латексный шар розовый',
            type: 'latex' as const,
            price: 25,
            image: '/api/placeholder/300/300',
            category: 'latex',
            withHelium: true,
            size: '30см',
            colors: ['Розовый'],
            material: 'Латекс',
            inStock: true
        },
        {
            id: '5',
            name: 'Сердце розовое',
            type: 'foil' as const,
            price: 140,
            image: '/api/placeholder/300/300',
            category: 'hearts',
            withHelium: true,
            size: '45см',
            colors: ['Розовый'],
            material: 'Фольга',
            inStock: true
        },
        {
            id: '6',
            name: 'Звезда серебряная',
            type: 'foil' as const,
            price: 110,
            oldPrice: 130,
            discount: 15,
            image: '/api/placeholder/300/300',
            category: 'stars',
            withHelium: true,
            size: '50см',
            colors: ['Серебряный'],
            material: 'Фольга',
            inStock: false
        }
    ],

    bouquets: [
        {
            id: '1',
            name: 'Букет "С днем рождения"',
            type: 'bouquet' as const,
            price: 450,
            image: '/api/placeholder/300/300',
            category: 'birthday',
            withHelium: true,
            material: 'Фольга + Латекс',
            inStock: true
        },
        {
            id: '2',
            name: 'Букет "Романтический вечер"',
            type: 'bouquet' as const,
            price: 550,
            oldPrice: 650,
            discount: 15,
            image: '/api/placeholder/300/300',
            category: 'romantic',
            withHelium: true,
            material: 'Фольга + Латекс',
            inStock: true
        },
        {
            id: '3',
            name: 'Букет "Для выпускника"',
            type: 'bouquet' as const,
            price: 480,
            image: '/api/placeholder/300/300',
            category: 'graduation',
            withHelium: true,
            material: 'Фольга + Латекс',
            inStock: true
        },
        {
            id: '4',
            name: 'Букет "Детский праздник"',
            type: 'bouquet' as const,
            price: 400,
            image: '/api/placeholder/300/300',
            category: 'kids',
            withHelium: true,
            material: 'Фольга + Латекс',
            inStock: true
        },
        {
            id: '5',
            name: 'Букет "Юбилей"',
            type: 'bouquet' as const,
            price: 750,
            oldPrice: 850,
            discount: 12,
            image: '/api/placeholder/300/300',
            category: 'anniversary',
            withHelium: true,
            material: 'Фольга + Латекс',
            inStock: true
        },
        {
            id: '6',
            name: 'Букет "Свадебный"',
            type: 'bouquet' as const,
            price: 850,
            image: '/api/placeholder/300/300',
            category: 'wedding',
            withHelium: true,
            material: 'Фольга + Латекс',
            inStock: true
        }
    ],

    cups: [
        {
            id: '1',
            name: 'Стаканчики "День рождения" бумажные',
            type: 'cup' as const,
            price: 80,
            image: '/api/placeholder/300/300',
            category: 'birthday',
            material: 'Бумага',
            size: '200мл',
            colors: ['Разноцветный'],
            inStock: true
        },
        {
            id: '2',
            name: 'Стаканчики "Единорог" картонные',
            type: 'cup' as const,
            price: 95,
            oldPrice: 120,
            discount: 21,
            image: '/api/placeholder/300/300',
            category: 'unicorn',
            material: 'Бумага',
            size: '250мл',
            colors: ['Розовый', 'Голубой'],
            inStock: true
        },
        {
            id: '3',
            name: 'Стаканчики "Супергерои" пластиковые',
            type: 'cup' as const,
            price: 110,
            image: '/api/placeholder/300/300',
            category: 'superhero',
            material: 'Пластик',
            size: '300мл',
            colors: ['Красный', 'Синий'],
            inStock: true
        },
        {
            id: '4',
            name: 'Стаканчики "Принцессы" бумажные',
            type: 'cup' as const,
            price: 90,
            image: '/api/placeholder/300/300',
            category: 'princess',
            material: 'Бумага',
            size: '200мл',
            colors: ['Розовый'],
            inStock: true
        },
        {
            id: '5',
            name: 'Стаканчики "Свадебные" экологические',
            type: 'cup' as const,
            price: 150,
            oldPrice: 180,
            discount: 17,
            image: '/api/placeholder/300/300',
            category: 'wedding',
            material: 'Эко',
            size: '250мл',
            colors: ['Белый', 'Золотой'],
            inStock: true
        },
        {
            id: '6',
            name: 'Стаканчики "Новый год" картонные',
            type: 'cup' as const,
            price: 100,
            image: '/api/placeholder/300/300',
            category: 'newyear',
            material: 'Бумага',
            size: '300мл',
            colors: ['Зеленый', 'Красный'],
            inStock: true
        }
    ],

    gifts: [
        {
            id: '1',
            name: 'Мягкая игрушка "Медвежонок"',
            type: 'plush' as const,
            price: 250,
            image: '/api/placeholder/300/300',
            category: 'plush',
            material: 'Плюш',
            inStock: true
        },
        {
            id: '2',
            name: 'Сувенир "С днем рождения"',
            type: 'souvenir' as const,
            price: 180,
            oldPrice: 220,
            discount: 18,
            image: '/api/placeholder/300/300',
            category: 'souvenirs',
            material: 'Керамика',
            inStock: true
        },
        {
            id: '3',
            name: 'Браслет "Для лучшей подруги"',
            type: 'jewelry' as const,
            price: 320,
            image: '/api/placeholder/300/300',
            category: 'jewelry',
            material: 'Металл',
            inStock: true
        },
        {
            id: '4',
            name: 'Набор конфет "Праздничный"',
            type: 'sweets' as const,
            price: 350,
            image: '/api/placeholder/300/300',
            category: 'sweets',
            material: 'Конфеты',
            inStock: true
        },
        {
            id: '5',
            name: 'Букет цветов "Весенний"',
            type: 'flowers' as const,
            price: 450,
            oldPrice: 550,
            discount: 18,
            image: '/api/placeholder/300/300',
            category: 'flowers',
            material: 'Живые цветы',
            inStock: true
        },
        {
            id: '6',
            name: 'Подарочный набор "Новорожденному"',
            type: 'plush' as const,
            price: 720,
            image: '/api/placeholder/300/300',
            category: 'newborn',
            material: 'Смешанный',
            inStock: true
        }
    ],

    sets: [
        {
            id: '1',
            name: 'Набор "День рождения мальчика"',
            type: 'set' as const,
            price: 980,
            oldPrice: 1200,
            discount: 18,
            image: '/api/placeholder/300/300',
            category: 'boy-birthday',
            material: 'Фольга + Латекс',
            inStock: true
        },
        {
            id: '2',
            name: 'Набор "День рождения девочки"',
            type: 'set' as const,
            price: 950,
            oldPrice: 1150,
            discount: 17,
            image: '/api/placeholder/300/300',
            category: 'girl-birthday',
            material: 'Фольга + Латекс',
            inStock: true
        },
        {
            id: '3',
            name: 'Набор "Романтический вечер"',
            type: 'set' as const,
            price: 1200,
            image: '/api/placeholder/300/300',
            category: 'romantic',
            material: 'Фольга + Латекс',
            inStock: true
        },
        {
            id: '4',
            name: 'Набор "Выписка из роддома"',
            type: 'set' as const,
            price: 1350,
            oldPrice: 1500,
            discount: 10,
            image: '/api/placeholder/300/300',
            category: 'newborn',
            material: 'Фольга + Латекс',
            inStock: true
        },
        {
            id: '5',
            name: 'Набор "Выпускной"',
            type: 'set' as const,
            price: 1400,
            image: '/api/placeholder/300/300',
            category: 'graduation',
            material: 'Фольга + Латекс',
            inStock: true
        },
        {
            id: '6',
            name: 'Набор "Юбилей 50 лет"',
            type: 'set' as const,
            price: 1500,
            oldPrice: 1800,
            discount: 17,
            image: '/api/placeholder/300/300',
            category: 'anniversary',
            material: 'Фольга + Латекс',
            inStock: true
        }
    ]
}

// Функция для получения товаров по категории
export const getProductsByCategory = (category: keyof typeof PRODUCTS_DATA) => {
    return PRODUCTS_DATA[category] || []
}

// Функция для получения товара по ID и категории
export const getProductById = (category: keyof typeof PRODUCTS_DATA, id: string) => {
    const products = PRODUCTS_DATA[category] || []
    return products.find(product => product.id === id)
}