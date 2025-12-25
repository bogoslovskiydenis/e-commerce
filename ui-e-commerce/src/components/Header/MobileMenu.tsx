'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronDown, Phone, Mail } from 'lucide-react'
import { apiService, Category } from '@/services/api'

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

interface MenuItem {
    id: string;
    title: string;
    href: string;
    isSpecial?: boolean;
    children?: Category[];
    hasChildren?: boolean;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set())
    const [contactPhone, setContactPhone] = useState<string>('(067) 111-11-11')
    const [contactPhone2, setContactPhone2] = useState<string>('(050) 111-11-11')
    const [contactEmail, setContactEmail] = useState<string>('google@gmail.com')

    const loadMenuData = async () => {
        try {
            // Загружаем категории для навигации
            const categories = await apiService.getNavigationCategories()
            const mainCategories = categories
                .filter(cat => !cat.parentId && cat.showInNavigation)
                .map(cat => ({
                    id: cat.id,
                    title: cat.name,
                    href: `/${cat.slug}`,
                    isSpecial: cat.type === 'promotions' || cat.slug === 'sale',
                    children: cat.children || [],
                    hasChildren: (cat.children && cat.children.length > 0) || false
                }))

            // Добавляем специальные пункты
            const specialItems: MenuItem[] = [
                {
                    id: 'sale',
                    title: 'Акции',
                    href: '/sale',
                    isSpecial: true
                }
            ]

            // Добавляем информационные страницы
            const infoItems: MenuItem[] = [
                { id: 'about', title: 'Про нас', href: '/about' },
                { id: 'delivery', title: 'Доставка', href: '/delivery' },
                { id: 'contacts', title: 'Контакты', href: '/contacts' }
            ]

            const allItems = [...mainCategories, ...specialItems, ...infoItems]
            setMenuItems(allItems)

            // Загружаем контакты
            const settings = await apiService.getPublicSettings()
            if (settings.contact_phone) {
                setContactPhone(settings.contact_phone as string)
            }
            if (settings.contact_phone_2) {
                setContactPhone2(settings.contact_phone_2 as string)
            }
            if (settings.contact_email) {
                setContactEmail(settings.contact_email as string)
            }
        } catch (error) {
            console.error('Error loading menu data:', error)
            // Оставляем дефолтные значения при ошибке
        }
    }

    useEffect(() => {
        if (isOpen) {
            loadMenuData()
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            // Небольшая задержка для запуска анимации
            setTimeout(() => setIsAnimating(true), 10)
        } else {
            setIsAnimating(false)
            // Ждем завершения анимации перед скрытием
            setTimeout(() => setIsVisible(false), 300)
        }
    }, [isOpen])

    // Функция для переключения подменю
    const toggleSubmenu = (itemId: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const newOpenSubmenus = new Set(openSubmenus)
        if (newOpenSubmenus.has(itemId)) {
            newOpenSubmenus.delete(itemId)
        } else {
            newOpenSubmenus.add(itemId)
        }
        setOpenSubmenus(newOpenSubmenus)
    }

    // Функция для закрытия меню при клике на ссылку
    const handleLinkClick = () => {
        setIsAnimating(false)
        setTimeout(() => {
            onClose()
        }, 300)
    }

    // Функция для закрытия меню с анимацией
    const handleClose = () => {
        setIsAnimating(false)
        setTimeout(() => {
            onClose()
        }, 300)
    }

    if (!isVisible) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 z-[199] ${
                    isAnimating ? 'opacity-50' : 'opacity-0'
                }`}
                onClick={handleClose}
            />

            {/* Menu - перемещаем слева */}
            <div className={`fixed inset-y-0 left-0 w-full max-w-sm bg-white z-[200] transform transition-transform duration-300 ease-in-out ${
                isAnimating ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b bg-teal-600 text-white">
                        <span className="text-xl font-bold">Логотип</span>
                        <button onClick={handleClose}>
                            <X size={24} />
                        </button>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 overflow-y-auto">
                        <nav>
                            {menuItems.map((item, index) => {
                                const isSpecial = item.isSpecial
                                const isInfoSection = item.id === 'about' || item.id === 'delivery' || item.id === 'contacts'
                                const prevItem = menuItems[index - 1]
                                const showDivider = prevItem && !prevItem.isSpecial && isInfoSection
                                const hasChildren = item.hasChildren && item.children && item.children.length > 0
                                const isOpen = openSubmenus.has(item.id)

                                return (
                                    <div key={item.id}>
                                        {showDivider && <div className="mt-4 border-t" />}
                                        <div className="border-b">
                                            {hasChildren ? (
                                                <button
                                                    onClick={(e) => toggleSubmenu(item.id, e)}
                                                    className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
                                                >
                                                    <span className={isSpecial ? 'text-red-600 font-semibold' : ''}>
                                                        {item.title}
                                                    </span>
                                                    {isOpen ? (
                                                        <ChevronDown size={20} className={isSpecial ? 'text-red-400' : 'text-gray-400'} />
                                                    ) : (
                                                        <ChevronRight size={20} className={isSpecial ? 'text-red-400' : 'text-gray-400'} />
                                                    )}
                                                </button>
                                            ) : (
                                                <Link
                                                    href={item.href}
                                                    className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
                                                    onClick={handleLinkClick}
                                                >
                                                    <span className={isSpecial ? 'text-red-600 font-semibold' : ''}>
                                                        {item.title}
                                                    </span>
                                                    <ChevronRight size={20} className={isSpecial ? 'text-red-400' : 'text-gray-400'} />
                                                </Link>
                                            )}
                                            
                                            {/* Подменю */}
                                            {hasChildren && isOpen && (
                                                <div className="bg-gray-50">
                                                    {item.children?.map((child) => (
                                                        <Link
                                                            key={child.id}
                                                            href={`/${child.slug}`}
                                                            className="flex items-center justify-between px-8 py-3 border-b border-gray-200 hover:bg-gray-100 transition-colors"
                                                            onClick={handleLinkClick}
                                                        >
                                                            <span className="text-sm text-gray-700">{child.name}</span>
                                                            <ChevronRight size={16} className="text-gray-400" />
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-auto border-t bg-gray-50">
                        <div className="p-4 space-y-3">
                            {contactPhone && (
                                <a
                                    href={`tel:${contactPhone.replace(/\s/g, '')}`}
                                    className="flex items-center gap-3 text-teal-600 hover:text-teal-700 transition-colors"
                                >
                                    <Phone size={20} />
                                    <span>{contactPhone}</span>
                                </a>
                            )}
                            {contactPhone2 && (
                                <a
                                    href={`tel:${contactPhone2.replace(/\s/g, '')}`}
                                    className="flex items-center gap-3 text-teal-600 hover:text-teal-700 transition-colors"
                                >
                                    <Phone size={20} />
                                    <span>{contactPhone2}</span>
                                </a>
                            )}
                            {contactEmail && (
                                <a
                                    href={`mailto:${contactEmail}`}
                                    className="flex items-center gap-3 text-teal-600 hover:text-teal-700 transition-colors"
                                >
                                    <Mail size={20} />
                                    <span className="text-sm">{contactEmail}</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}