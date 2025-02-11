import { Eye, EyeOff } from 'lucide-react'

interface LoginFormProps {
    email: string
    setEmail: (email: string) => void
    password: string
    setPassword: (password: string) => void
    passwordVisible: boolean
    setPasswordVisible: (visible: boolean) => void
}

export function LoginForm({
                              email,
                              setEmail,
                              password,
                              setPassword,
                              passwordVisible,
                              setPasswordVisible
                          }: LoginFormProps) {
    return (
        <div className="space-y-4">
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

            <button className="w-full py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                Увійти
            </button>

            <button className="text-sm text-center w-full">
                Я не пам'ятаю свій пароль
            </button>

            <div className="text-center text-sm text-gray-500">
                <span>або продовжити через</span>
                <div className="flex justify-center gap-4 mt-4">
                    <button className="p-2 border rounded-full">
                        <img src="/" alt="Google" className="w-6 h-6" />
                    </button>
                    <button className="p-2 border rounded-full">
                        <img src="/" alt="Facebook" className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    )
}