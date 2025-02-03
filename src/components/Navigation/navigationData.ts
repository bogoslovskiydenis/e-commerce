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

type DropdownKey = 'Бренди' | 'Одяг' | 'Взуття' | 'Спортивні' | 'Аксесуари' | 'Преміум';

export const dropdownContent: Record<DropdownKey, DropdownItem> = {
    'Бренди': {
        sections: [
            {
                title: 'Популярні бренди',
                items: [
                    { name: 'KARL LAGERFELD', href: '#' },
                    { name: 'adidas', href: '#' },
                    { name: 'Polo Ralph Lauren', href: '#' },
                    { name: 'DeeZee', href: '#' },
                    { name: 'EA7 Emporio Armani', href: '#' },
                    { name: 'Marciano Guess', href: '#' },
                    { name: 'Rinascimento', href: '#' },
                    { name: 'Kontatto', href: '#' },
                    { name: 'Vero Moda', href: '#' },
                    { name: 'Triumph', href: '#' }
                ]
            },
            {
                title: 'Преміум',
                items: [
                    { name: 'Liu Jo', href: '#' },
                    { name: 'PINKO', href: '#' },
                    { name: 'HUGO', href: '#' },
                    { name: 'Weekend Max Mara', href: '#' },
                    { name: 'Elisabetta Franchi', href: '#' },
                    { name: 'Versace Jeans Couture', href: '#' },
                    { name: 'AMI PARIS', href: '#' },
                    { name: 'Marella', href: '#' },
                    { name: 'JACQUEMUS', href: '#' },
                    { name: 'Twinset', href: '#' }
                ]
            },
            {
                title: 'Designers',
                items: [
                    { name: 'Patrizia Pepe', href: '#' },
                    { name: 'Karl Lagerfeld', href: '#' },
                    { name: 'MICHAEL Michael Kors', href: '#' },
                    { name: 'Coach', href: '#' },
                    { name: 'Tory Burch', href: '#' },
                    { name: 'Lauren Ralph Lauren', href: '#' },
                    { name: 'BOSS', href: '#' },
                    { name: 'Rotate', href: '#' }
                ]
            }
        ],
        promoCards: [
            {
                image: '/images/brands/rinascimento.jpg',
                title: 'Відродження жіночності',
                subtitle: 'Rinascimento',
                link: '#'
            },
            {
                image: '/images/brands/elisabetta.jpg',
                title: 'Мікс елегантності та безтурботності',
                subtitle: 'Elisabetha Franchi',
                link: '#'
            }
        ]
    },
    'Одяг': {
        sections: [
            {
                title: 'Категорії',
                items: [
                    { name: 'Безрукавки', href: '#' },
                    { name: 'Білизна', href: '#' },
                    { name: 'Блузи та сорочки', href: '#' },
                    { name: 'Джинси', href: '#' },
                    { name: 'Жилети', href: '#' },
                    { name: 'Кардигани', href: '#' },
                    { name: 'Костюми', href: '#' },
                    { name: 'Пальта', href: '#' },
                    { name: 'Плаття', href: '#' },
                    { name: 'Спідниці', href: '#' }
                ]
            },
            {
                title: 'Популярні бренди',
                items: [
                    { name: 'Zara', href: '#' },
                    { name: 'H&M', href: '#' },
                    { name: 'Mango', href: '#' },
                    { name: 'Reserved', href: '#' },
                    { name: 'Tommy Hilfiger', href: '#' }
                ]
            }
        ],
        promoCards: [
            {
                image: '/images/clothing/dresses.jpg',
                title: 'Нова колекція',
                subtitle: 'Плаття',
                link: '#'
            },
            {
                image: '/images/clothing/outerwear.jpg',
                title: 'Верхній одяг',
                subtitle: 'Зима 2024',
                link: '#'
            }
        ]
    },
    'Взуття': {
        sections: [
            {
                title: 'Категорії',
                items: [
                    { name: 'Балетки', href: '#' },
                    { name: 'Босоніжки', href: '#' },
                    { name: 'Кросівки', href: '#' },
                    { name: 'Туфлі', href: '#' },
                    { name: 'Черевики', href: '#' }
                ]
            },
            {
                title: 'Бренди',
                items: [
                    { name: 'Nike', href: '#' },
                    { name: 'Adidas', href: '#' },
                    { name: 'New Balance', href: '#' },
                    { name: 'Converse', href: '#' },
                    { name: 'Puma', href: '#' }
                ]
            }
        ],
        promoCards: [
            {
                image: '/images/shoes/sneakers.jpg',
                title: 'Спортивне взуття',
                subtitle: 'Нова колекція',
                link: '#'
            },
            {
                image: '/images/shoes/boots.jpg',
                title: 'Осінь-Зима 2024',
                subtitle: 'Черевики',
                link: '#'
            }
        ]
    },
    'Спортивні': {
        sections: [
            {
                title: 'Категорії',
                items: [
                    { name: 'Футболки', href: '#' },
                    { name: 'Шорти', href: '#' },
                    { name: 'Спортивні костюми', href: '#' },
                    { name: 'Кросівки', href: '#' },
                    { name: 'Аксесуари', href: '#' }
                ]
            },
            {
                title: 'Бренди',
                items: [
                    { name: 'Nike', href: '#' },
                    { name: 'Adidas', href: '#' },
                    { name: 'Puma', href: '#' },
                    { name: 'Under Armour', href: '#' },
                    { name: 'Reebok', href: '#' }
                ]
            }
        ],
        promoCards: [
            {
                image: '/images/sport/running.jpg',
                title: 'Біг',
                subtitle: 'Нова колекція',
                link: '#'
            },
            {
                image: '/images/sport/training.jpg',
                title: 'Тренування',
                subtitle: 'Спортивний одяг',
                link: '#'
            }
        ]
    },
    'Аксесуари': {
        sections: [
            {
                title: 'Категорії',
                items: [
                    { name: 'Сумки', href: '#' },
                    { name: 'Гаманці', href: '#' },
                    { name: 'Ремені', href: '#' },
                    { name: 'Шапки', href: '#' },
                    { name: 'Шарфи', href: '#' }
                ]
            },
            {
                title: 'Бренди',
                items: [
                    { name: 'Michael Kors', href: '#' },
                    { name: 'Calvin Klein', href: '#' },
                    { name: 'Tommy Hilfiger', href: '#' },
                    { name: 'Guess', href: '#' },
                    { name: 'Liu Jo', href: '#' }
                ]
            }
        ],
        promoCards: [
            {
                image: '/images/accessories/bags.jpg',
                title: 'Сумки',
                subtitle: 'Нова колекція',
                link: '#'
            },
            {
                image: '/images/accessories/scarves.jpg',
                title: 'Шарфи та шапки',
                subtitle: 'Зима 2024',
                link: '#'
            }
        ]
    },
    'Преміум': {
        sections: [
            {
                title: 'Категорії',
                items: [
                    { name: 'Одяг', href: '#' },
                    { name: 'Взуття', href: '#' },
                    { name: 'Сумки', href: '#' },
                    { name: 'Аксесуари', href: '#' }
                ]
            },
            {
                title: 'Бренди',
                items: [
                    { name: 'Gucci', href: '#' },
                    { name: 'Prada', href: '#' },
                    { name: 'Fendi', href: '#' },
                    { name: 'Balenciaga', href: '#' },
                    { name: 'Saint Laurent', href: '#' }
                ]
            }
        ],
        promoCards: [
            {
                image: '/images/premium/luxury.jpg',
                title: 'Люкс',
                subtitle: 'Нова колекція',
                link: '#'
            },
            {
                image: '/images/premium/accessories.jpg',
                title: 'Аксесуари',
                subtitle: 'Преміум колекція',
                link: '#'
            }
        ]
    }
};