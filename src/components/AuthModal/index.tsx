'use client'
import { X, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    type: 'login' | 'register'
}

export function AuthModal({ isOpen, onClose, type }: AuthModalProps) {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [selectedGender, setSelectedGender] = useState<string>('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[480px] p-6 relative">
                <button onClick={onClose} className="absolute right-4 top-4">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-medium text-center mb-6">
                    {type === 'login' ? 'Раді бачити Тебе знову!' : 'Приємно познайомитись!'}
                </h2>

                <div className="flex gap-2 border-b mb-6">
                    <button
                        className={`pb-2 px-4 ${type === 'login' ? 'border-b-2 border-black' : ''}`}
                    >
                        Ввійти
                    </button>
                    <button
                        className={`pb-2 px-4 ${type === 'register' ? 'border-b-2 border-black' : ''}`}
                    >
                        Створити акаунт
                    </button>
                </div>

                {type === 'register' && (
                    <>
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 bg-gray-200 rounded-full"></span>
                                Додаткові знижки на покупки
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 bg-gray-200 rounded-full"></span>
                                Створи акаунт за 10 секунд
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 bg-gray-200 rounded-full"></span>
                                Купуй відні іншиде
                            </div>
                        </div>

                        <input
                            type="text"
                            placeholder="Ім'я"
                            className="w-full p-3 border rounded mb-4"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </>
                )}

                <input
                    type="email"
                    placeholder="Адреса e-mail"
                    className="w-full p-3 border rounded mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className="relative mb-4">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Пароль"
                        className="w-full p-3 border rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {type === 'register' && (
                    <>
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 bg-gray-200 rounded-full"></span>
                                Мала і велика літери
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 bg-gray-200 rounded-full"></span>
                                Спеціальний символ або цифра
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 bg-gray-200 rounded-full"></span>
                                Мінімум 8 символів
                            </div>

                            <div className="mt-6">
                                <p className="mb-2">Зазвичай купую у відділі:</p>
                                <div className="flex gap-2">
                                    {['Жінка', 'Чоловік', 'Дитина'].map((gender) => (
                                        <button
                                            key={gender}
                                            onClick={() => setSelectedGender(gender)}
                                            className={`px-4 py-2 border rounded ${
                                                selectedGender === gender ? 'border-black' : ''
                                            }`}
                                        >
                                            {gender}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <label className="flex items-start gap-2 mb-4">
                            <input type="checkbox" className="mt-1" />
                            <span className="text-sm">
                Хочу приєднатися до MODIVO FASHION CLUB і отримувати додаткові знижки на покупки
              </span>
                        </label>

                        <label className="flex items-start gap-2 mb-6">
                            <input type="checkbox" className="mt-1" />
                            <span className="text-sm">
                Даю згоду на отримання від Modivo S.A. з головним офісом в Зеленій Гурі на електронну адресу комерційної інформації компанії та її суб'єктів з якими співпрацює, згідно з правилами.
              </span>
                        </label>
                    </>
                )}

                <button className="w-full py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                    {type === 'login' ? 'Ввійти' : 'Створити акаунт'}
                </button>

                {type === 'login' && (
                    <>
                        <button className="text-sm text-center w-full mt-4">
                            Я не пам'ятаю свій пароль
                        </button>

                        <div className="text-center text-sm text-gray-500 mt-6">
                            <span>або продовжити через</span>
                            <div className="flex justify-center gap-4 mt-4">
                                <button className="p-2 border rounded-full">
                                    <img src="/google.svg" alt="Google" className="w-6 h-6" />
                                </button>
                                <button className="p-2 border rounded-full">
                                    <img src="/facebook.svg" alt="Facebook" className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}