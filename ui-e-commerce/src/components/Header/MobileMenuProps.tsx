'use client'

import Link from 'next/link'
import { X, ChevronRight } from 'lucide-react'

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white z-[200]">
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <span className="text-2xl">E</span>
                    <button onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* Categories */}
                <div className="flex gap-6 px-4 py-3 border-b">
                    <Link href="/zinka" className="font-medium">ЖІНКА</Link>
                    <Link href="/cholovik" className="text-gray-500">ЧОЛОВІК</Link>
                    <Link href="/dytyna" className="text-gray-500">ДИТИНА</Link>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto">
                    <nav>
                        <Link href="/nova-kolekcia" className="flex items-center justify-between px-4 py-4 border-b">
                            <span>Нова колекція</span>
                            <ChevronRight size={20} className="text-gray-400" />
                        </Link>
                        <Link href="/bestsellers" className="flex items-center justify-between px-4 py-4 border-b">
                            <span>Бестселери</span>
                        </Link>
                        <Link href="/brands" className="flex items-center justify-between px-4 py-4 border-b">
                            <span>Бренди</span>
                            <ChevronRight size={20} className="text-gray-400" />
                        </Link>
                        <Link href="/clothing" className="flex items-center justify-between px-4 py-4 border-b">
                            <span>Одяг</span>
                            <ChevronRight size={20} className="text-gray-400" />
                        </Link>
                        <Link href="/shoes" className="flex items-center justify-between px-4 py-4 border-b">
                            <span>Взуття</span>
                            <ChevronRight size={20} className="text-gray-400" />
                        </Link>
                        <Link href="/sport" className="flex items-center justify-between px-4 py-4 border-b">
                            <span>Спортивні</span>
                            <ChevronRight size={20} className="text-gray-400" />
                        </Link>
                        <Link href="/bags" className="flex items-center justify-between px-4 py-4 border-b">
                            <span>Сумки</span>
                            <ChevronRight size={20} className="text-gray-400" />
                        </Link>
                        <Link href="/accessories" className="flex items-center justify-between px-4 py-4 border-b">
                            <span>Аксесуари</span>
                            <ChevronRight size={20} className="text-gray-400" />
                        </Link>
                        <Link href="/premium" className="flex items-center justify-between px-4 py-4 border-b">
                            <span>Преміум</span>
                            <ChevronRight size={20} className="text-gray-400" />
                        </Link>
                        <Link href="/special-offer" className="flex items-center justify-between px-4 py-4 border-b">
                            <span className="text-red-600">Special Offer</span>
                        </Link>
                    </nav>
                </div>

                {/* Bottom Links */}
                <div className="mt-auto border-t">
                    <Link
                        href="/download"
                        className="flex items-center gap-3 px-4 py-4 border-b"
                    >
                        <span className="p-2 bg-gray-100 rounded">📱</span>
                        <span className="text-sm">Завантажити моб. додаток</span>
                    </Link>
                    <Link
                        href="/help"
                        className="flex items-center gap-3 px-4 py-4"
                    >
                        <span className="p-2 bg-gray-100 rounded">❓</span>
                        <span className="text-sm">Допомога</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}