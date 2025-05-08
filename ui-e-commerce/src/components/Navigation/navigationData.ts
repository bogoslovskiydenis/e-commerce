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

type DropdownKey = 'Шарики' | 'Коробки'
    // | 'Взуття' | 'Спортивні' | 'Аксесуари' | 'Преміум'
    ;

export const dropdownContent: Record<DropdownKey, DropdownItem> = {
    'Шарики': {
        sections: [
            {
                title: 'Популярні шарики',
                items: [
                    { name: '1', href: '#' },
                    { name: '2', href: '#' },
                    { name: '2', href: '#' },
                    { name: '3', href: '#' },
                    { name: '4', href: '#' },
                    { name: '5', href: '#' },
                ]
            },
            {
                title: 'Коробки шарики',
                items: [
                    { name: '1', href: '#' },
                    { name: '2', href: '#' },
                    { name: '2', href: '#' },
                    { name: '3', href: '#' },
                    { name: '4', href: '#' },
                    { name: '5', href: '#' },
                ]
            },
            {
                title: 'Стаканчики',
                items: [
                    { name: '1', href: '#' },
                    { name: '2', href: '#' },
                    { name: '3', href: '#' },
                    { name: '4', href: '#' },
                ]
            }
        ],
        promoCards: [
            {
                image: '/images/sharik.png',
                title: 'Шарик 1 ',
                subtitle: 'Rinascimento',
                link: '#'
            },
            {
                image: '/images/sharik.png',
                title: 'Шарик 2',
                subtitle: 'Elisabetha Franchi',
                link: '#'
            }
        ]
    },
    'Коробки': {
        sections: [
            {
                title: 'Категорії Коробок',
                items: [
                    { name: '1', href: '#' },
                    { name: '2', href: '#' },
                    { name: '3', href: '#' },
                    { name: '4', href: '#' },
                ]
            },
            {
                title: 'Популярні коробки',
                items: [
                    { name: '1', href: '#' },
                    { name: '2', href: '#' },
                    { name: '3', href: '#' },
                    { name: '4', href: '#' },
                ]
            }
        ],
        promoCards: [
            {
                image: '/images/korobka/korobka.jpeg',
                title: 'Картинка для коробок',
                subtitle: 'Коробка',
                link: '#'
            },
            // {
            //     image: '/images/clothing/outerwear.jpg',
            //     title: 'Верхній одяг',
            //     subtitle: 'Зима 2024',
            //     link: '#'
            // }
        ]
    },
    // 'Взуття': {
    //     sections: [
    //         {
    //             title: 'Категорії',
    //             items: [
    //                 { name: 'Балетки', href: '#' },
    //                 { name: 'Босоніжки', href: '#' },
    //                 { name: 'Кросівки', href: '#' },
    //                 { name: 'Туфлі', href: '#' },
    //                 { name: 'Черевики', href: '#' }
    //             ]
    //         },
    //         {
    //             title: 'Бренди',
    //             items: [
    //                 { name: 'Nike', href: '#' },
    //                 { name: 'Adidas', href: '#' },
    //                 { name: 'New Balance', href: '#' },
    //                 { name: 'Converse', href: '#' },
    //                 { name: 'Puma', href: '#' }
    //             ]
    //         }
    //     ],
    //     promoCards: [
    //         {
    //             image: '/images/shoes/sneakers.jpg',
    //             title: 'Спортивне взуття',
    //             subtitle: 'Нова колекція',
    //             link: '#'
    //         },
    //         {
    //             image: '/images/shoes/boots.jpg',
    //             title: 'Осінь-Зима 2024',
    //             subtitle: 'Черевики',
    //             link: '#'
    //         }
    //     ]
    // },
    // 'Спортивні': {
    //     sections: [
    //         {
    //             title: 'Категорії',
    //             items: [
    //                 { name: 'Футболки', href: '#' },
    //                 { name: 'Шорти', href: '#' },
    //                 { name: 'Спортивні костюми', href: '#' },
    //                 { name: 'Кросівки', href: '#' },
    //                 { name: 'Аксесуари', href: '#' }
    //             ]
    //         },
    //         {
    //             title: 'Бренди',
    //             items: [
    //                 { name: 'Nike', href: '#' },
    //                 { name: 'Adidas', href: '#' },
    //                 { name: 'Puma', href: '#' },
    //                 { name: 'Under Armour', href: '#' },
    //                 { name: 'Reebok', href: '#' }
    //             ]
    //         }
    //     ],
    //     promoCards: [
    //         {
    //             image: '/images/sport/running.jpg',
    //             title: 'Біг',
    //             subtitle: 'Нова колекція',
    //             link: '#'
    //         },
    //         {
    //             image: '/images/sport/training.jpg',
    //             title: 'Тренування',
    //             subtitle: 'Спортивний одяг',
    //             link: '#'
    //         }
    //     ]
    // },
    // 'Аксесуари': {
    //     sections: [
    //         {
    //             title: 'Категорії',
    //             items: [
    //                 { name: 'Сумки', href: '#' },
    //                 { name: 'Гаманці', href: '#' },
    //                 { name: 'Ремені', href: '#' },
    //                 { name: 'Шапки', href: '#' },
    //                 { name: 'Шарфи', href: '#' }
    //             ]
    //         },
    //         {
    //             title: 'Бренди',
    //             items: [
    //                 { name: 'Michael Kors', href: '#' },
    //                 { name: 'Calvin Klein', href: '#' },
    //                 { name: 'Tommy Hilfiger', href: '#' },
    //                 { name: 'Guess', href: '#' },
    //                 { name: 'Liu Jo', href: '#' }
    //             ]
    //         }
    //     ],
    //     promoCards: [
    //         {
    //             image: '/images/accessories/bags.jpg',
    //             title: 'Сумки',
    //             subtitle: 'Нова колекція',
    //             link: '#'
    //         },
    //         {
    //             image: '/images/accessories/scarves.jpg',
    //             title: 'Шарфи та шапки',
    //             subtitle: 'Зима 2024',
    //             link: '#'
    //         }
    //     ]
    // },
    // 'Преміум': {
    //     sections: [
    //         {
    //             title: 'Категорії',
    //             items: [
    //                 { name: 'Одяг', href: '#' },
    //                 { name: 'Взуття', href: '#' },
    //                 { name: 'Сумки', href: '#' },
    //                 { name: 'Аксесуари', href: '#' }
    //             ]
    //         },
    //         {
    //             title: 'Бренди',
    //             items: [
    //                 { name: 'Gucci', href: '#' },
    //                 { name: 'Prada', href: '#' },
    //                 { name: 'Fendi', href: '#' },
    //                 { name: 'Balenciaga', href: '#' },
    //                 { name: 'Saint Laurent', href: '#' }
    //             ]
    //         }
    //     ],
    //     promoCards: [
    //         {
    //             image: '/images/premium/luxury.jpg',
    //             title: 'Люкс',
    //             subtitle: 'Нова колекція',
    //             link: '#'
    //         },
    //         {
    //             image: '/images/premium/accessories.jpg',
    //             title: 'Аксесуари',
    //             subtitle: 'Преміум колекція',
    //             link: '#'
    //         }
    //     ]
    // }
};