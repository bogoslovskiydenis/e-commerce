import Link from 'next/link'

export default function SimpleHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center h-16 relative">
                    <div className="flex items-center gap-2">
                        <Link href="/" className=" text-gray-600 hover:text-teal-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                            </svg>
                        </Link>
                        <Link href="/" className="text-2xl font-bold text-teal-600">
                            Логотип
                        </Link>
                    </div>


                </div>
            </div>
        </header>
    )
}