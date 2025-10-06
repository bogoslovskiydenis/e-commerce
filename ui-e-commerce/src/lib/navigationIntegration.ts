// Интеграция статических данных навигации с динамическими из админ панели
export const dropdownContent = {
    'Шарики': {
        categories: [
            { name: 'Фольгированные шары', href: '/balloons/foil', count: 0 },
            { name: 'Латексные шары', href: '/balloons/latex', count: 0 },
            { name: 'Цифры из шаров', href: '/balloons/numbers', count: 0 },
            { name: 'Сердца', href: '/balloons/hearts', count: 0 },
            { name: 'Звезды', href: '/balloons/stars', count: 0 },
            { name: 'Шары с рисунком', href: '/balloons/printed', count: 0 },
            { name: 'Светящиеся шары', href: '/balloons/led', count: 0 }
        ],
        featured: [],
        promotions: [
            {
                title: 'Скидка 20%',
                description: 'На все фольгированные шары',
                href: '/balloons/foil?discount=20'
            }
        ]
    },
    'Букеты из шаров': {
        categories: [
            { name: 'Букеты для детей', href: '/bouquets/kids', count: 0 },
            { name: 'Романтические букеты', href: '/bouquets/romantic', count: 0 },
            { name: 'Поздравительные', href: '/bouquets/congratulations', count: 0 },
            { name: 'Корпоративные', href: '/bouquets/corporate', count: 0 }
        ],
        featured: [],
        promotions: []
    },
    'Стаканчики': {
        categories: [
            { name: 'Бумажные стаканчики', href: '/cups/paper', count: 0 },
            { name: 'Пластиковые стаканчики', href: '/cups/plastic', count: 0 },
            { name: 'Эко стаканчики', href: '/cups/eco', count: 0 }
        ],
        featured: [],
        promotions: []
    },
    'Подарки': {
        categories: [
            { name: 'Мягкие игрушки', href: '/gifts/plush', count: 0 },
            { name: 'Сувениры', href: '/gifts/souvenirs', count: 0 },
            { name: 'Украшения', href: '/gifts/jewelry', count: 0 },
            { name: 'Конфеты и сладости', href: '/gifts/sweets', count: 0 }
        ],
        featured: [],
        promotions: []
    },
    'Наборы': {
        categories: [
            { name: 'Готовые праздничные наборы', href: '/sets/party', count: 0 },
            { name: 'Наборы для дня рождения', href: '/sets/birthday', count: 0 },
            { name: 'Свадебные наборы', href: '/sets/wedding', count: 0 },
            { name: 'Корпоративные наборы', href: '/sets/corporate', count: 0 }
        ],
        featured: [],
        promotions: []
    }
};

// Хук для постепенной миграции на новую навигацию
export function useMigrationMode() {
    const isNewNavigationEnabled = process.env.NEXT_PUBLIC_NEW_NAVIGATION === 'true';
    const isDevelopment = process.env.NODE_ENV === 'development';

    return {
        useNewNavigation: isNewNavigationEnabled,
        isTransitioning: !isNewNavigationEnabled && isDevelopment
    };
}

// Функция для объединения статических и динамических данных навигации
export function mergeNavigationData(staticData: typeof dropdownContent, dynamicCategories: any[]): typeof dropdownContent {
    const mergedData = { ...staticData };
    // Логика объединения данных
    return mergedData;
}

// Утилита для преобразования старых путей в новые
export function migrateNavigationPaths(oldPath: string): string {
    const pathMigrations: Record<string, string> = {
        '/balloons': '/categories/balloons',
        '/bouquets': '/categories/bouquets',
        '/cups': '/categories/cups',
        '/gifts': '/categories/gifts',
        '/sets': '/categories/sets'
    };

    return pathMigrations[oldPath] || oldPath;
}
