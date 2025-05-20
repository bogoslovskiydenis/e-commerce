'use client'

interface QuickOrderStep {
    icon: string;
    title: string;
    description: string;
}

interface QuickOrderSectionProps {
    title: string;
    subtitle?: string;
    steps: QuickOrderStep[];
    bgColor?: string;
    iconBgColor?: string;
}

export default function QuickOrderSection({
                                              title,
                                              subtitle,
                                              steps,
                                              bgColor = 'bg-gray-50',
                                              iconBgColor = 'bg-teal-100'
                                          }: QuickOrderSectionProps) {
    // Calculate the grid columns based on the number of steps
    let gridClass = '';

    if (steps.length === 2) {
        gridClass = 'grid-cols-1 sm:grid-cols-2';
    } else if (steps.length === 3) {
        gridClass = 'grid-cols-1 sm:grid-cols-3';
    } else if (steps.length === 4) {
        gridClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    } else {
        // Default for other numbers (like the original with special span)
        gridClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }

    return (
        <div className={`${bgColor} py-6 sm:py-8 lg:py-12`}>
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-4 sm:mb-6 lg:mb-8">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-center text-gray-600 mb-6">
                            {subtitle}
                        </p>
                    )}
                    <div className={`grid ${gridClass} gap-4 sm:gap-6`}>
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`bg-white p-4 sm:p-6 rounded-lg shadow-sm text-center ${
                                    steps.length === 3 && index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''
                                }`}
                            >
                                <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 ${iconBgColor} rounded-full flex items-center justify-center`}>
                                    <span className="text-xl sm:text-2xl">{step.icon}</span>
                                </div>
                                <h3 className="font-semibold mb-2 text-sm sm:text-base">{step.title}</h3>
                                <p className="text-gray-600 text-xs sm:text-sm">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}