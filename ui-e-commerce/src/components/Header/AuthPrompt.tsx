'use client'

interface AuthPromptProps {
    onLogin: () => void
    onRegister: () => void
}

export function AuthPrompt({ onLogin, onRegister }: AuthPromptProps) {
    return (
        <div className="bg-white rounded shadow-lg p-6 w-[400px] z-[99999]">
            <div className="flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </div>
            <h3 className="text-xl text-center mb-4">Ласкаво просимо до E!</h3>
            <p className="text-center text-gray-600 mb-6">
                Увійди та переглянь свої покупки, улюблені товари та сповіщення.
            </p>
            <div className="flex gap-4">
                <button onClick={onLogin} className="flex-1 py-2 bg-black text-white rounded">
                    Увійти
                </button>
                <button onClick={onRegister} className="flex-1 py-2 border rounded">
                    Створити акаунт
                </button>
            </div>
        </div>
    )
}