// Товары в корзине
import Image from 'next/image'
import { Heart, ShoppingBag } from 'lucide-react'

const sizes = ['36', '37', '38', '39', '40', '41', '42']
const colors = ['Білий', 'Чорний', 'Коричневий']

export default function ProductPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Изображения продукта */}
                <div className="space-y-4">
                    <div className="aspect-square relative">
                        <Image
                            src="/images/products/1.jpg"
                            alt="Product"
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square relative cursor-pointer">
                                <Image
                                    src="/images/products/1.jpg"
                                    alt={`Preview ${i}`}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Информация о продукте */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold">Kappa</h1>
                        <p className="text-lg text-gray-600">Снікерси · Білий</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold">2 599 грн</span>
                        <span className="text-lg text-gray-500 line-through">3 299 грн</span>
                        <span className="text-lg text-red-600">-20%</span>
                    </div>

                    {/* Размеры */}
                    <div>
                        <h3 className="text-lg font-medium mb-2">Розмір</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    className="py-2 border rounded-lg hover:border-black"
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Цвета */}
                    <div>
                        <h3 className="text-lg font-medium mb-2">Колір</h3>
                        <div className="flex gap-2">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    className="px-4 py-2 border rounded-lg hover:border-black"
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Кнопки действий */}
                    <div className="flex gap-4">
                        <button className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2">
                            <ShoppingBag size={20} />
                            Додати в кошик
                        </button>
                        <button className="p-3 border rounded-lg hover:border-black">
                            <Heart size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}