'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { X, ChevronRight, Phone, Mail } from 'lucide-react'

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

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
                        <span className="text-xl font-bold">ШАРИКИ НА ДОМ</span>
                        <button onClick={handleClose}>
                            <X size={24} />
                        </button>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 overflow-y-auto">
                        <nav>
                            <Link
                                href="/balloons"
                                className="flex items-center justify-between px-4 py-4 border-b hover:bg-gray-50 transition-colors"
                                onClick={handleLinkClick}
                            >
                                <span>Шарики</span>
                                <ChevronRight size={20} className="text-gray-400" />
                            </Link>
                            <Link
                                href="/bouquets"
                                className="flex items-center justify-between px-4 py-4 border-b hover:bg-gray-50 transition-colors"
                                onClick={handleLinkClick}
                            >
                                <span>Букеты из шаров</span>
                                <ChevronRight size={20} className="text-gray-400" />
                            </Link>
                            <Link
                                href="/cups"
                                className="flex items-center justify-between px-4 py-4 border-b hover:bg-gray-50 transition-colors"
                                onClick={handleLinkClick}
                            >
                                <span>Стаканчики</span>
                                <ChevronRight size={20} className="text-gray-400" />
                            </Link>
                            <Link
                                href="/gifts"
                                className="flex items-center justify-between px-4 py-4 border-b hover:bg-gray-50 transition-colors"
                                onClick={handleLinkClick}
                            >
                                <span>Подарки</span>
                                <ChevronRight size={20} className="text-gray-400" />
                            </Link>
                            <Link
                                href="/sets"
                                className="flex items-center justify-between px-4 py-4 border-b hover:bg-gray-50 transition-colors"
                                onClick={handleLinkClick}
                            >
                                <span>Наборы</span>
                                <ChevronRight size={20} className="text-gray-400" />
                            </Link>
                            <Link
                                href="/promotions"
                                className="flex items-center justify-between px-4 py-4 border-b hover:bg-gray-50 transition-colors"
                                onClick={handleLinkClick}
                            >
                                <span className="text-red-600 font-semibold">Акции</span>
                                <ChevronRight size={20} className="text-red-400" />
                            </Link>

                            {/* Info Links */}
                            <div className="mt-4 border-t">
                                <Link
                                    href="/about"
                                    className="flex items-center justify-between px-4 py-4 border-b hover:bg-gray-50 transition-colors"
                                    onClick={handleLinkClick}
                                >
                                    <span>Про нас</span>
                                    <ChevronRight size={20} className="text-gray-400" />
                                </Link>
                                <Link
                                    href="/delivery"
                                    className="flex items-center justify-between px-4 py-4 border-b hover:bg-gray-50 transition-colors"
                                    onClick={handleLinkClick}
                                >
                                    <span>Доставка</span>
                                    <ChevronRight size={20} className="text-gray-400" />
                                </Link>
                                <Link
                                    href="/contacts"
                                    className="flex items-center justify-between px-4 py-4 border-b hover:bg-gray-50 transition-colors"
                                    onClick={handleLinkClick}
                                >
                                    <span>Контакты</span>
                                    <ChevronRight size={20} className="text-gray-400" />
                                </Link>
                            </div>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-auto border-t bg-gray-50">
                        <div className="p-4 space-y-3">
                            <a
                                href="tel:(067) 111-11-11"
                                className="flex items-center gap-3 text-teal-600 hover:text-teal-700 transition-colors"
                            >
                                <Phone size={20} />
                                <span>(067) 111-11-11</span>
                            </a>
                            <a
                                href="tel:(050) 111-11-11"
                                className="flex items-center gap-3 text-teal-600 hover:text-teal-700 transition-colors"
                            >
                                <Phone size={20} />
                                <span>(050) 111-11-11</span>
                            </a>
                            <a
                                href="mailto:google@gmail.com"
                                className="flex items-center gap-3 text-teal-600 hover:text-teal-700 transition-colors"
                            >
                                <Mail size={20} />
                                <span className="text-sm">google@gmail.com</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}