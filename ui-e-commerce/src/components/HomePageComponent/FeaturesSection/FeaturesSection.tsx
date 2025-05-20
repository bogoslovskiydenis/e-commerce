'use client'

interface Feature {
    icon: string;
    title: string;
    description: string;
}

interface FeaturesSectionProps {
    title: string;
    subtitle?: string;
    features: Feature[];
    columns?: 2 | 3 | 4;
    bgColor?: string;
    iconBgColor?: string;
}

export default function FeaturesSection({
                                            title,
                                            subtitle,
                                            features,
                                            columns = 4,
                                            bgColor = 'bg-white',
                                            iconBgColor = 'bg-teal-100'
                                        }: FeaturesSectionProps) {
    // Map number of columns to grid classes
    const columnClasses = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    }

    return (
        <div className={`${bgColor} py-8 sm:py-12 lg:py-16`}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className={`grid ${columnClasses[columns]} gap-6 sm:gap-8`}>
                    {features.map((feature, index) => (
                        <div key={index} className="text-center">
                            <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 ${iconBgColor} rounded-full flex items-center justify-center`}>
                                <span className="text-2xl sm:text-3xl">{feature.icon}</span>
                            </div>
                            <h3 className="font-semibold text-base sm:text-lg mb-2">{feature.title}</h3>
                            <p className="text-gray-600 text-sm sm:text-base">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}