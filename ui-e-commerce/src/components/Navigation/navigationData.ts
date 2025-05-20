type DropdownItem = {
    sections: {
        title: string;
        items: {
            name: string;
            href: string;
        }[];
    }[];
    promoCards: {
        image: string;
        title: string;
        subtitle: string;
        link: string;
    }[];
}

type DropdownKey = 'Шарики' | 'Букеты из шаров' | 'Стаканчики' | 'Подарки' | 'Наборы';

export const dropdownContent: Record<DropdownKey, DropdownItem> = {
    'Шарики': {
        sections: [
            {
                title: 'По типу',
                items: [
                    { name: 'Фольгированные', href: '/balloons/foil' },
                    { name: 'Латексные', href: '/balloons/latex' },
                    { name: 'С гелием', href: '/balloons/helium' },
                    { name: 'Без гелия', href: '/balloons/air' },
                    { name: 'Светящиеся', href: '/balloons/led' },
                    { name: 'Миниатюрные', href: '/balloons/mini' },
                ]
            },
            {
                title: 'По событию',
                items: [
                    { name: 'День рождения', href: '/balloons/birthday' },
                    { name: 'Свадьба', href: '/balloons/wedding' },
                    { name: 'Выпускной', href: '/balloons/graduation' },
                    { name: '8 марта', href: '/balloons/march8' },
                    { name: 'День Святого Валентина', href: '/balloons/valentine' },
                    { name: 'Новый год', href: '/balloons/newyear' },
                ]
            },
            {
                title: 'По цвету',
                items: [
                    { name: 'Красные', href: '/balloons/red' },
                    { name: 'Синие', href: '/balloons/blue' },
                    { name: 'Розовые', href: '/balloons/pink' },
                    { name: 'Золотые', href: '/balloons/gold' },
                    { name: 'Серебряные', href: '/balloons/silver' },
                    { name: 'Разноцветные', href: '/balloons/multicolor' },
                ]
            }
        ],
        promoCards: [
            {
                image: '/images/hard.jpg',
                title: 'Фольгированные сердца',
                subtitle: 'От 150 грн',
                link: '/balloons/foil-hearts'
            },
            {
                image: '/images/hard.jpg',
                title: 'Набор на день рождения',
                subtitle: 'От 500 грн',
                link: '/balloons/birthday-set'
            }
        ]
    },
    'Букеты из шаров': {
        sections: [
            {
                title: 'По размеру',
                items: [
                    { name: 'Мини букеты (3-5 шаров)', href: '/bouquets/mini' },
                    { name: 'Средние (7-10 шаров)', href: '/bouquets/medium' },
                    { name: 'Большие (15+ шаров)', href: '/bouquets/large' },
                    { name: 'Огромные (25+ шаров)', href: '/bouquets/huge' },
                ]
            },
            {
                title: 'По тематике',
                items: [
                    { name: 'Романтические', href: '/bouquets/romantic' },
                    { name: 'Детские', href: '/bouquets/kids' },
                    { name: 'Корпоративные', href: '/bouquets/corporate' },
                    { name: 'Праздничные', href: '/bouquets/festive' },
                ]
            }
        ],
        promoCards: [
            {
                image: '/images/bouquets/romantic.jpg',
                title: 'Романтический букет',
                subtitle: 'От 450 грн',
                link: '/bouquets/romantic'
            },
            {
                image: '/images/bouquets/birthday.jpg',
                title: 'День рождения',
                subtitle: 'От 350 грн',
                link: '/bouquets/birthday'
            }
        ]
    },
    'Стаканчики': {
        sections: [
            {
                title: 'Материал',
                items: [
                    { name: 'Пластиковые', href: '/cups/plastic' },
                    { name: 'Бумажные', href: '/cups/paper' },
                    { name: 'Экологические', href: '/cups/eco' },
                ]
            },
            {
                title: 'Размер',
                items: [
                    { name: '200 мл', href: '/cups/200ml' },
                    { name: '300 мл', href: '/cups/300ml' },
                    { name: '500 мл', href: '/cups/500ml' },
                ]
            },
            {
                title: 'Тематика',
                items: [
                    { name: 'День рождения', href: '/cups/birthday' },
                    { name: 'Единорог', href: '/cups/unicorn' },
                    { name: 'Супергерои', href: '/cups/superhero' },
                    { name: 'Принцессы', href: '/cups/princess' },
                ]
            }
        ],
        promoCards: [
            {
                image: '/images/cups/birthday-set.jpg',
                title: 'Набор стаканчиков',
                subtitle: 'От 80 грн',
                link: '/cups/birthday-set'
            }
        ]
    },
    'Подарки': {
        sections: [
            {
                title: 'Категории',
                items: [
                    { name: 'Мягкие игрушки', href: '/gifts/plush' },
                    { name: 'Сувениры', href: '/gifts/souvenirs' },
                    { name: 'Украшения', href: '/gifts/jewelry' },
                    { name: 'Конфеты', href: '/gifts/sweets' },
                    { name: 'Цветы', href: '/gifts/flowers' },
                ]
            },
            {
                title: 'По поводу',
                items: [
                    { name: 'День рождения', href: '/gifts/birthday' },
                    { name: 'Юбилей', href: '/gifts/anniversary' },
                    { name: 'Свадьба', href: '/gifts/wedding' },
                    { name: 'Новорожденный', href: '/gifts/newborn' },
                ]
            }
        ],
        promoCards: [
            {
                image: '/images/gifts/teddy-bear.jpg',
                title: 'Мягкие игрушки',
                subtitle: 'От 250 грн',
                link: '/gifts/plush'
            },
            {
                image: '/images/gifts/gift-box.jpg',
                title: 'Подарочные наборы',
                subtitle: 'От 500 грн',
                link: '/gifts/sets'
            }
        ]
    },
    'Наборы': {
        sections: [
            {
                title: 'Готовые наборы',
                items: [
                    { name: 'День рождения мальчика', href: '/sets/boy-birthday' },
                    { name: 'День рождения девочки', href: '/sets/girl-birthday' },
                    { name: 'Романтический вечер', href: '/sets/romantic' },
                    { name: 'Выписка из роддома', href: '/sets/newborn' },
                    { name: 'Выпускной', href: '/sets/graduation' },
                ]
            },
            {
                title: 'Собрать набор',
                items: [
                    { name: 'Конструктор наборов', href: '/sets/constructor' },
                    { name: 'Индивидуальный заказ', href: '/sets/custom' },
                ]
            }
        ],
        promoCards: [
            {
                image: '/images/sets/birthday-boy.jpg',
                title: 'День рождения мальчика',
                subtitle: 'От 800 грн',
                link: '/sets/boy-birthday'
            },
            {
                image: '/images/sets/birthday-girl.jpg',
                title: 'День рождения девочки',
                subtitle: 'От 800 грн',
                link: '/sets/girl-birthday'
            }
        ]
    }
};