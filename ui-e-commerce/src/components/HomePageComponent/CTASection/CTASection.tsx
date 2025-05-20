'use client'

import Link from 'next/link'

interface Button {
    text: string;
    href: string;
    primary?: boolean;
    icon?: string;
}

interface CTASectionProps {
    title: string;
    subtitle?: string;
    buttons: Button[];
    bgColor?: string;
    textColor?: string;
    align?: 'left' | 'center' | 'right';
}

export default function CTASection({
                                       title,
                                       subtitle,
                                       buttons,
                                       bgColor = 'bg-teal-600',
                                       textColor = 'text-white',
                                       align = 'center'
                                   }: CTASectionProps) {
    // Map alignment to text alignment classes
    const alignClasses = {
        'left': 'text-left',
        'center': 'text-center',
        'right': 'text-right'
    }

    // Map alignment to flex alignment for buttons
    const flexAlignClasses = {
        'left': 'justify-start',
        'center': 'justify-center',
        'right': 'justify-end'
    }

    return (
        <div className={`${bgColor} ${textColor} py-12 sm:py-16 lg:py-20`}>
            <div className="container mx-auto px-4 ">
                <div className={alignClasses[align]}>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    )}

                    <div className={`flex flex-col xs:flex-row gap-3 sm:gap-4 ${flexAlignClasses[align]} ${align === 'center' ? 'max-w-lg mx-auto' : ''}`}>
                        {buttons.map((button, index) => (
                            button.primary ? (
                                <Link
                                    key={index}
                                    href={button.href}
                                    className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-teal-600 rounded-lg hover:bg-gray-100 font-medium text-sm sm:text-base transition-colors"
                                >
                                    {button.icon && <span className="mr-2">{button.icon}</span>}
                                    {button.text}
                                </Link>
                            ) : (
                                <Link
                                    key={index}
                                    href={button.href}
                                    className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-teal-600 font-medium text-sm sm:text-base transition-colors"
                                >
                                    {button.icon && <span className="mr-2">{button.icon}</span>}
                                    {button.text}
                                </Link>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}