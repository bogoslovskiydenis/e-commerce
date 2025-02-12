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
    { title: 'Sale %', href: '/sale', isSpecial: true },
    { title: 'Бестселери', href: '/bestsellers' },
    { title: 'Нова колекція', href: '/nova-kolekcia' },
    { title: 'Бренди', href: '/brands', hasDropdown: true },
    { title: 'Одяг', href: '/clothing', hasDropdown: true },
    { title: 'Взуття', href: '/shoes', hasDropdown: true },
    { title: 'Спортивні', href: '/sport', hasDropdown: true },
    { title: 'Аксесуари', href: '/accessories', hasDropdown: true },
    { title: 'Преміум', href: '/premium', hasDropdown: true },
    { title: 'Special Offer', href: '/special-offer', isSpecial: true }
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
                                    className={`nav-link block px-4 py-4 text-sm ${
                                        item.isSpecial ? 'text-red-600' : 'text-gray-900'
                                    }`}
                                >
                                    {item.title}
                                </Link>

                                {item.hasDropdown && hoveredItem === item.title && dropdownContent[item.title] && (
                                    <div
                                        className="nav-dropdown"
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            right: 0,
                                            top: '100%',
                                            zIndex: 50,
                                            background: 'white',
                                            borderBottom: '1px solid #e5e7eb',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    >
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