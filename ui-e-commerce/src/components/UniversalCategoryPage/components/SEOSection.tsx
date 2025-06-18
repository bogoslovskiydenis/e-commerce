'use client'

interface SEOSectionProps {
    title: string;
    description: string[];
}

export default function SEOSection({ title, description }: SEOSectionProps) {
    return (
        <div className="mt-16 bg-gray-50 p-6 sm:p-8 rounded-lg">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">{title}</h2>
            <div className="prose max-w-none text-gray-600 text-sm sm:text-base">
                {description.map((paragraph, index) => (
                    <p key={index} className={index < description.length - 1 ? "mb-4" : ""}>
                        {paragraph}
                    </p>
                ))}
            </div>
        </div>
    )
}