interface AuthTabsProps {
    activeTab: 'login' | 'register'
    onTabChange: (tab: 'login' | 'register') => void
}

export function AuthTabs({activeTab, onTabChange}: AuthTabsProps) {
    return (
        <div className="flex gap-2 border-b mb-6">
            <button
                onClick={() => onTabChange('login')}
                className={`pb-2 px-4 ${activeTab === 'login' ? 'border-b-2 border-black' : ''}`}
            >
                Увійти
            </button>
            <button
                onClick={() => onTabChange('register')}
                className={`pb-2 px-4 ${activeTab === 'register' ? 'border-b-2 border-black' : ''}`}
            >
                Створити акаунт
            </button>
        </div>
    )
}