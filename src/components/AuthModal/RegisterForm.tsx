import { Eye, EyeOff } from 'lucide-react'

interface RegisterFormProps {
    email: string
    setEmail: (email: string) => void
    password: string
    setPassword: (password: string) => void
    name: string
    setName: (name: string) => void
    selectedGender: string
    setSelectedGender: (gender: string) => void
    passwordVisible: boolean
    setPasswordVisible: (visible: boolean) => void
}

export function RegisterForm({
                                 email,
                                 setEmail,
                                 password,
                                 setPassword,
                                 name,
                                 setName,
                                 selectedGender,
                                 setSelectedGender,
                                 passwordVisible,
                                 setPasswordVisible
                             }: RegisterFormProps) {
    return (
        <div className="space-y-4">
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
                className="w-full p-3 border rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="email"
                placeholder="Адреса e-mail"
                className="w-full p-3 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
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

            <div>
                <p className="mb-2">Зазвичай купую у відділі:</p>
                <div className="flex gap-2">
                    {['Жінка', 'Чоловік', 'Дитина'].map((gender) => (
                        <button
                            key={gender}
                            onClick={() => setSelectedGender(gender)}
                            className={`px-4 py-2 border rounded ${selectedGender === gender ? 'border-black' : ''}`}
                        >
                            {gender}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <label className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-sm">
            Хочу приєднатися до Ecommerce
          </span>
                </label>

                <label className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-sm">
            Даю згоду на отримання від Ecommerce S.A. з головним офісом в Зеленій Гурі на електронну адресу комерційної інформації компанії та її суб'єктів з якими співпрацює, згідно з правилами.
          </span>
                </label>
            </div>

            <button className="w-full py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                Створити акаунт
            </button>
        </div>
    )
}