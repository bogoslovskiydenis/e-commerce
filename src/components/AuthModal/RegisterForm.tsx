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
            <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Ім&apos;я
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Введіть ім&apos;я"
                />
            </div>

            <div>
                <label htmlFor="register-email" className="block text-sm font-medium mb-2">
                    Email
                </label>
                <input
                    type="email"
                    id="register-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Введіть email"
                />
            </div>

            <div>
                <label htmlFor="register-password" className="block text-sm font-medium mb-2">
                    Пароль
                </label>
                <div className="relative">
                    <input
                        type={passwordVisible ? 'text' : 'password'}
                        id="register-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Створіть пароль"
                    />
                    <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                    Мінімум 8 символів
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Стать
                </label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setSelectedGender('female')}
                        className={`px-4 py-2 border rounded-lg ${
                            selectedGender === 'female' ? 'border-black' : ''
                        }`}
                    >
                        Жіноча
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedGender('male')}
                        className={`px-4 py-2 border rounded-lg ${
                            selectedGender === 'male' ? 'border-black' : ''
                        }`}
                    >
                        Чоловіча
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <label className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-sm">
                        Я погоджуюсь отримувати інформацію про новинки та акції
                    </span>
                </label>
            </div>

            <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800">
                Створити акаунт
            </button>
        </div>
    )
}