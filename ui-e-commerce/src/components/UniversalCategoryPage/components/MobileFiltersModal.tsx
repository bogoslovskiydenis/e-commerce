'use client'

import { X } from 'lucide-react'
import SidebarFilters from './SidebarFilters'
import { CategoryConfig } from '@/config/categoryConfig'

interface MobileFiltersModalProps {
    isOpen: boolean;
    onClose: () => void;
    categoryKey: string;
    config: CategoryConfig;
}

export default function MobileFiltersModal({
                                               isOpen,
                                               onClose,
                                               categoryKey,
                                               config
                                           }: MobileFiltersModalProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={onClose}
            />

            {/* Модальное окно с фильтрами */}
            <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 shadow-lg lg:hidden">
                <div className="flex flex-col h-full">
                    {/* Заголовок модального окна */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold">Фильтры</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-gray-700"
                            aria-label="Закрыть фильтры"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Содержимое фильтров */}
                    <div className="flex-1 overflow-y-auto">
                        <SidebarFilters categoryKey={categoryKey} config={config} isMobile={true} />
                    </div>

                    {/* Кнопки действий */}
                    <div className="p-4 border-t bg-gray-50 space-y-3">
                        <button
                            className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                            onClick={onClose}
                        >
                            Применить фильтры
                        </button>
                        <button
                            className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm"
                            onClick={onClose}
                        >
                            Сбросить все
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}