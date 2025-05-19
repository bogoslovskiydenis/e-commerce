'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DropdownMenu } from './DropdownMenu'
import { dropdownContent } from './navigationData'

interface NavigationItem {
    title: string;
    href: string;
    isSpecial?: boolean;
    hasDropdown?: boolean;
}

const navigationItems: NavigationItem[] = [
    { title: 'Шарики', href: '/balloons', hasDropdown: true },
    { title: 'Букеты из шаров', href: '/bouquets', hasDropdown: true },
    { title: 'Стаканчики', href: '/cups', hasDropdown: true },
    { title: 'Подарки', href: '/gifts', hasDropdown: true },
    { title: 'Наборы', href: '/sets', hasDropdown: true },
    { title: 'Акции', href: '/sale', isSpecial: true },
];

type DropdownKey = keyof typeof dropdownContent;

export default function Navigation() {
    const [hoveredItem, setHoveredItem] = useState<DropdownKey | null>(null);

    const handleMouseEnter = (title: string) => {
        console.log('Mouse enter:', title);
        if (isDropdownKey(title)) {
            setHoveredItem(title);
        }
    };

    const handleMouseLeave = () => {
        console.log('Mouse leave');
        setHoveredItem(null);
    };

    const isDropdownKey = (title: string): title is DropdownKey => {
        return title in dropdownContent;
    };

    useEffect(() => {
        console.log('Current hovered item:', hoveredItem);
        if (hoveredItem) {
            console.log('Dropdown content for', hoveredItem, ':', dropdownContent[hoveredItem]);
        }
    }, [hoveredItem]);

    return (
        <div className="relative">
            <nav className="bg-white border-t border-b">
                <div className="container mx-auto">
                    <ul className="flex">
                        {navigationItems.map((item) => (
                            <li
                                key={item.title}
                                className={`nav-item ${hoveredItem === item.title ? 'hovered' : ''}`}
                                onMouseEnter={() => handleMouseEnter(item.title)}
                                onMouseLeave={handleMouseLeave}
                                style={{ background: hoveredItem === item.title ? '#f3f4f6' : 'transparent' }}
                            >
                                <Link
                                    href={item.href}
                                    className={`nav-link block px-6 py-4 text-sm ${
                                        item.isSpecial ? 'text-red-600 font-semibold' : 'text-gray-900'
                                    }`}
                                >
                                    {item.title}
                                </Link>

                                {item.hasDropdown && hoveredItem === item.title && dropdownContent[item.title] && (
                                    <div className="nav-dropdown">
                                        <DropdownMenu content={dropdownContent[item.title]} />
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </div>
    );
}