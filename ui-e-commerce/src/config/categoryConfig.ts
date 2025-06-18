export interface CategoryConfig {
    title: string;
    description: string;
    seoTitle: string;
    seoDescription: string[];
    basePath: string;
    categories: Array<{
        name: string;
        count: number;
        href: string;
    }>;
    filters: Array<{
        name: string;
        color: string;
    }>;
    sortOptions?: Array<{
        value: string;
        label: string;
    }>;
}

// Конфигурации для разных категорий
export const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
    balloons: {
        title: "Воздушные шарики",
        description: "Большой выбор фольгированных и латексных шаров с доставкой по Киеву",
        seoTitle: "Воздушные шарики в Киеве",
        seoDescription: [
            'Интернет-магазин "Шарики на дом" предлагает широкий выбор воздушных шаров для любого праздника. У нас вы найдете фольгированные и латексные шары, букеты, цифры, сердца и звезды.',
            'Мы осуществляем быструю доставку по Киеву в течение 2 часов. Все шары наполняются качественным гелием, который обеспечивает долгое время полета.',
            'Оформить заказ можно на сайте или по телефону. Наши консультанты помогут подобрать идеальное оформление для вашего события.'
        ],
        basePath: "/balloons",
        categories: [
            { name: 'Фольгированные шары', count: 245, href: '/balloons/foil' },
            { name: 'Латексные шары', count: 187, href: '/balloons/latex' },
            { name: 'Цифры из шаров', count: 45, href: '/balloons/numbers' },
            { name: 'Сердца', count: 89, href: '/balloons/hearts' },
            { name: 'Звезды', count: 67, href: '/balloons/stars' },
            { name: 'Шары с рисунком', count: 134, href: '/balloons/printed' },
            { name: 'Светящиеся шары', count: 78, href: '/balloons/led' },
            { name: 'Букеты из шаров', count: 156, href: '/bouquets' },
            { name: 'Стаканчики', count: 95, href: '/cups' },
            { name: 'Подарки', count: 203, href: '/gifts' },
            { name: 'Готовые наборы', count: 112, href: '/sets' }
        ],
        filters: [
            { name: 'С гелием', color: 'bg-teal-100 text-teal-800' },
            { name: 'Фольгированные', color: 'bg-blue-100 text-blue-800' }
        ]
    },

    bouquets: {
        title: "Букеты из воздушных шаров",
        description: "Красивые букеты из шаров для любого праздника с доставкой по Киеву",
        seoTitle: "Букеты из воздушных шаров в Киеве",
        seoDescription: [
            'Наш интернет-магазин предлагает широкий выбор букетов из воздушных шаров для любого события. У нас вы найдете букеты для дня рождения, свадьбы, юбилея, выпускного и других праздников.',
            'Мы используем только качественные материалы и наполняем шары гелием, что обеспечивает долгое время полета. Доставка по Киеву осуществляется в течение 2 часов.',
            'Закажите букет из шаров прямо сейчас и порадуйте своих близких ярким и оригинальным подарком!'
        ],
        basePath: "/bouquets",
        categories: [
            { name: 'Дни рождения', count: 45, href: '/bouquets/birthday' },
            { name: 'Романтика', count: 32, href: '/bouquets/romantic' },
            { name: 'Свадьба', count: 20, href: '/bouquets/wedding' },
            { name: 'Детские праздники', count: 38, href: '/bouquets/kids' },
            { name: 'Выпускные', count: 15, href: '/bouquets/graduation' },
            { name: 'Корпоративные', count: 22, href: '/bouquets/corporate' },
            { name: 'Юбилеи', count: 18, href: '/bouquets/anniversary' },
        ],
        filters: [
            { name: 'С гелием', color: 'bg-teal-100 text-teal-800' },
            { name: 'Стойкие', color: 'bg-blue-100 text-blue-800' }
        ]
    },

    cups: {
        title: "Праздничные стаканчики",
        description: "Бумажные и пластиковые стаканчики с яркими принтами для вашего праздника",
        seoTitle: "Праздничные стаканчики в Киеве",
        seoDescription: [
            'Наш магазин предлагает широкий ассортимент праздничных стаканчиков для любого мероприятия. У нас вы найдете бумажные, пластиковые и экологические стаканчики различных размеров и дизайнов.',
            'Мы предлагаем стаканчики с яркими принтами для детских праздников, дней рождения, свадеб и других торжеств. Все изделия изготовлены из качественных материалов и безопасны для использования.',
            'Заказывайте праздничные стаканчики с доставкой по Киеву и создавайте незабываемую атмосферу на вашем празднике!'
        ],
        basePath: "/cups",
        categories: [
            { name: 'Бумажные', count: 28, href: '/cups/paper' },
            { name: 'Пластиковые', count: 15, href: '/cups/plastic' },
            { name: 'Экологические', count: 10, href: '/cups/eco' },
            { name: '200мл', count: 18, href: '/cups/200ml' },
            { name: '250мл', count: 20, href: '/cups/250ml' },
            { name: '300мл', count: 15, href: '/cups/300ml' },
            { name: 'День рождения', count: 22, href: '/cups/birthday' },
            { name: 'Единорог', count: 8, href: '/cups/unicorn' },
            { name: 'Супергерои', count: 12, href: '/cups/superhero' },
            { name: 'Принцессы', count: 10, href: '/cups/princess' },
        ],
        filters: [
            { name: 'Детская тематика', color: 'bg-pink-100 text-pink-800' },
            { name: 'Бумажные', color: 'bg-amber-100 text-amber-800' }
        ]
    },

    gifts: {
        title: "Подарки и сувениры",
        description: "Оригинальные подарки для любого праздника и торжества",
        seoTitle: "Подарки и сувениры в Киеве",
        seoDescription: [
            'В нашем магазине представлен широкий выбор подарков и сувениров для любого повода. Мы предлагаем мягкие игрушки, стильные украшения, вкусные конфеты, свежие цветы и многое другое.',
            'Каждый подарок тщательно подобран, чтобы принести радость и оставить яркие впечатления. Мы помогаем вам выразить свои чувства через особенные подарки для ваших близких.',
            'Доставка подарков осуществляется по Киеву в течение дня. Сделайте заказ прямо сейчас и порадуйте своих близких оригинальным и запоминающимся подарком!'
        ],
        basePath: "/gifts",
        categories: [
            { name: 'Мягкие игрушки', count: 25, href: '/gifts/plush' },
            { name: 'Сувениры', count: 32, href: '/gifts/souvenirs' },
            { name: 'Украшения', count: 18, href: '/gifts/jewelry' },
            { name: 'Конфеты', count: 15, href: '/gifts/sweets' },
            { name: 'Цветы', count: 20, href: '/gifts/flowers' },
            { name: 'По поводу', count: 0, href: '#' },
            { name: 'День рождения', count: 28, href: '/gifts/birthday' },
            { name: 'Юбилей', count: 15, href: '/gifts/anniversary' },
            { name: 'Свадьба', count: 12, href: '/gifts/wedding' },
            { name: 'Новорожденному', count: 18, href: '/gifts/newborn' },
        ],
        filters: [
            { name: 'В наличии', color: 'bg-green-100 text-green-800' },
            { name: 'Со скидкой', color: 'bg-red-100 text-red-800' }
        ]
    },

    sets: {
        title: "Готовые наборы для праздника",
        description: "Комплексные решения для оформления праздников любого типа",
        seoTitle: "Готовые наборы для праздников в Киеве",
        seoDescription: [
            'Наш магазин предлагает готовые наборы для оформления различных праздников и торжеств. В каждый набор входят тщательно подобранные воздушные шары, декорации, стаканчики и другие аксессуары, которые создадут неповторимую атмосферу вашего события.',
            'Мы разработали наборы для дней рождений мальчиков и девочек, выпускных, романтических вечеров, юбилеев и других особых случаев. Каждый набор можно дополнить индивидуальными элементами по вашему желанию.',
            'Вы также можете воспользоваться нашим онлайн-конструктором наборов или заказать полностью индивидуальный комплект. Доставка по Киеву осуществляется в день заказа!'
        ],
        basePath: "/sets",
        categories: [
            { name: 'Дни рождения', count: 0, href: '#' },
            { name: 'День рождения мальчика', count: 15, href: '/sets/boy-birthday' },
            { name: 'День рождения девочки', count: 18, href: '/sets/girl-birthday' },
            { name: 'По поводу', count: 0, href: '#' },
            { name: 'Романтический вечер', count: 10, href: '/sets/romantic' },
            { name: 'Выписка из роддома', count: 12, href: '/sets/newborn' },
            { name: 'Выпускной', count: 8, href: '/sets/graduation' },
            { name: 'Юбилей', count: 14, href: '/sets/anniversary' },
            { name: 'Особые наборы', count: 0, href: '#' },
            { name: 'Конструктор наборов', count: 1, href: '/sets/constructor' },
            { name: 'Индивидуальный заказ', count: 1, href: '/sets/custom' },
        ],
        filters: [
            { name: 'Полный комплект', color: 'bg-purple-100 text-purple-800' },
            { name: 'Со скидкой', color: 'bg-red-100 text-red-800' }
        ],
        sortOptions: [
            { value: 'popular', label: 'По популярности' },
            { value: 'price-asc', label: 'Сначала дешевые' },
            { value: 'price-desc', label: 'Сначала дорогие' },
            { value: 'discount', label: 'По размеру скидки' },
            { value: 'items', label: 'По количеству предметов' },
            { value: 'new', label: 'Новинки' },
        ]
    }
};

// Дефолтные опции сортировки
export const DEFAULT_SORT_OPTIONS = [
    { value: 'popular', label: 'По популярности' },
    { value: 'price-asc', label: 'Сначала дешевые' },
    { value: 'price-desc', label: 'Сначала дорогие' },
    { value: 'name-asc', label: 'По названию А-Я' },
    { value: 'name-desc', label: 'По названию Я-А' },
    { value: 'new', label: 'Новинки' },
];