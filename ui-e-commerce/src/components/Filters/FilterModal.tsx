import { X } from 'lucide-react'

interface FilterModalProps {
    isOpen: boolean
    onClose: () => void
}

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg">
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Фільтри</h2>
                        <button onClick={onClose}>
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-4 space-y-6">
                    {/* Розмір */}
                    <div>
                        <h3 className="font-medium mb-2">Розмір</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {['36', '37', '38', '39', '40', '41', '42'].map((size) => (
                                <label key={size} className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span>{size}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Колір */}
                    <div>
                        <h3 className="font-medium mb-2">Колір</h3>
                        <div className="space-y-2">
                            {['Білий', 'Чорний', 'Синій', 'Червоний'].map((color) => (
                                <label key={color} className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span>{color}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Ціна */}
                    <div>
                        <h3 className="font-medium mb-2">Ціна</h3>
                        <div className="flex gap-4">
                            <input
                                type="number"
                                placeholder="Від"
                                className="w-full px-3 py-2 border rounded"
                            />
                            <input
                                type="number"
                                placeholder="До"
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
                    <div className="flex gap-4">
                        <button className="flex-1 px-4 py-2 border rounded hover:bg-gray-50">
                            Скинути
                        </button>
                        <button className="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
                            Застосувати
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}