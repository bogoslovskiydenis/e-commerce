import Image from 'next/image'
import { Trash2, Heart } from 'lucide-react'

const CartItem = () => {
    return (
        <div className="flex gap-4 py-4 border-b">
            <div className="relative w-24 h-24">
                <Image
                    src="/images/products/1.jpg"
                    alt="Product"
                    fill
                    className="object-cover rounded-lg"
                />
            </div>

            <div className="flex-1">
                <div className="flex justify-between">
                    <div>
                        <h3 className="font-medium">Kappa</h3>
                        <p className="text-sm text-gray-600">Снікерси · Білий</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold">2 599 грн</p>
                        <p className="text-sm text-gray-500 line-through">3 299 грн</p>
                    </div>
                </div>

                <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Розмір:</span>
                        <select className="py-1 px-2 border rounded">
                            <option>40</option>
                            <option>41</option>
                            <option>42</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm">Кількість:</span>
                        <select className="py-1 px-2 border rounded">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                        </select>
                    </div>
                </div>

                <div className="mt-2 flex gap-4">
                    <button className="text-sm text-gray-600 hover:text-black flex items-center gap-1">
                        <Heart size={16} />
                        В улюблене
                    </button>
                    <button className="text-sm text-gray-600 hover:text-black flex items-center gap-1">
                        <Trash2 size={16} />
                        Видалити
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function CartPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Кошик</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <CartItem />
                    <CartItem />
                </div>

                <div className="bg-gray-50 p-6 rounded-lg h-fit">
                    <h2 className="text-lg font-bold mb-4">Сума замовлення</h2>

                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                            <span>Товари (2)</span>
                            <span>5 198 грн</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Знижка</span>
                            <span className="text-red-600">-1 400 грн</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Доставка</span>
                            <span>0 грн</span>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between font-bold">
                            <span>Разом</span>
                            <span>3 798 грн</span>
                        </div>
                    </div>

                    <button className="w-full bg-black text-white py-3 rounded-lg mt-6 hover:bg-gray-800">
                        Оформити замовлення
                    </button>
                </div>
            </div>
        </div>
    )
}