export default function HomePage() {
    return (
        <div>
            {/* Баннер */}
            <div className="bg-neutral-300 h-[500px] relative">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-lg">
                        <h1 className="text-5xl font-bold text-white mb-6">
                            FINAL SALE
                        </h1>
                        <p className="text-xl text-white mb-8">
                            Фінал зимового розпродажу! Зберіть свій стиль за низькими цінами
                        </p>
                        <button className="px-8 py-3 bg-white text-black text-sm font-medium rounded-sm hover:bg-gray-100">
                            ПЕРЕВІРИТИ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}