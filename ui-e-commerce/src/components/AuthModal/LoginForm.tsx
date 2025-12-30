import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

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
            <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Введіть email"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Пароль
                </label>
                <div className="relative">
                    <input
                        type={passwordVisible ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Введіть пароль"
                    />
                    <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>

            <button className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors">
                Увійти
            </button>

            <div className="relative text-center">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t"></div>
                </div>
                <span className="relative bg-white px-4 text-sm text-gray-500">
                    або увійти через
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                    <Image
                        src=""
                        alt="Google"
                        width={20}
                        height={20}
                    />
                    Google
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                    <Image
                        src=""
                        alt="Facebook"
                        width={20}
                        height={20}
                    />
                    Facebook
                </button>
            </div>
        </div>
    )
}