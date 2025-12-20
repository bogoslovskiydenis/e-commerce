import Image from 'next/image'
import Link from 'next/link'

interface DropdownMenuProps {
    content: {
        sections: {
            title: string;
            items: Array<{
                name: string;
                href: string;
            }>;
        }[];
        promoCards?: Array<{
            image: string;
            title: string;
            subtitle: string;
            link: string;
        }>;
    };
}

export function DropdownMenu({ content }: DropdownMenuProps) {
    return (
        <div className="bg-white">
            <div className="container mx-auto">
                <div className="py-8">
                    <div className="grid grid-cols-4 gap-8">
                        {/* Sections */}
                        {content.sections.map((section, index) => (
                            <div key={section.title} className={index < content.sections.length - 1 ? 'border-r pr-8' : ''}>
                                <h3 className="font-bold mb-4">{section.title}</h3>
                                <ul className="space-y-2">
                                    {section.items.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className="block text-gray-600 hover:text-black"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                {index === 0 && (
                                    <Link
                                        href="#"
                                        className="block mt-4 text-gray-600 hover:text-black"
                                    >
                                        Показати все
                                    </Link>
                                )}
                            </div>
                        ))}

                        {/* Promo Cards */}
                        {content.promoCards && (
                            <div className="grid gap-6">
                                {content.promoCards.map((card, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="relative aspect-[1/1] h-[100px] w-[100px]">
                                            <Image
                                                src={card.image}
                                                alt={card.title}
                                                fill
                                                sizes="100px"
                                                className="object-cover"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-600">{card.subtitle}</p>
                                        <h4 className="font-medium">{card.title}</h4>
                                        <Link
                                            href={card.link}
                                            className="text-sm hover:underline"
                                        >
                                            Переглянути товари
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}