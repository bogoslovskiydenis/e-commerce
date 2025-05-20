'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Testimonial {
    name: string;
    text: string;
    rating: number;
    image?: string;
    date?: string;
}

interface TestimonialsSectionProps {
    title: string;
    subtitle?: string;
    testimonials: Testimonial[];
    bgColor?: string;
    slidesToShow?: number;
}

export default function TestimonialsSection({
                                                title,
                                                subtitle,
                                                testimonials,
                                                bgColor = 'bg-gray-50',
                                                slidesToShow = 3
                                            }: TestimonialsSectionProps) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const maxSlides = Math.max(0, testimonials.length - slidesToShow)

    const goToPrevSlide = () => {
        setCurrentSlide((prev) => Math.max(0, prev - 1))
    }

    const goToNextSlide = () => {
        setCurrentSlide((prev) => Math.min(maxSlides, prev + 1))
    }

    const canGoBack = currentSlide > 0
    const canGoForward = currentSlide < maxSlides

    return (
        <div className={`${bgColor} py-8 sm:py-12 lg:py-16`}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 sm:mb-8 lg:mb-10">
                    <div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-gray-600 mt-2">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center mt-4 md:mt-0">
                        <div className="flex gap-2">
                            <button
                                onClick={goToPrevSlide}
                                disabled={!canGoBack}
                                className={`p-2 rounded-full border ${canGoBack ? 'border-gray-300 hover:bg-gray-100' : 'border-gray-200 text-gray-300 cursor-not-allowed'}`}
                                aria-label="Предыдущие отзывы"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={goToNextSlide}
                                disabled={!canGoForward}
                                className={`p-2 rounded-full border ${canGoForward ? 'border-gray-300 hover:bg-gray-100' : 'border-gray-200 text-gray-300 cursor-not-allowed'}`}
                                aria-label="Следующие отзывы"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Testimonials */}
                <div className="relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-300"
                        style={{ transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)` }}
                    >
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="flex-none w-full sm:w-1/2 lg:w-1/3 px-2"
                                style={{ width: `${100 / slidesToShow}%` }}
                            >
                                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm h-full">
                                    <div className="flex items-center mb-3">
                                        {testimonial.image && (
                                            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                                <img
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <span className="font-semibold text-sm sm:text-base">{testimonial.name}</span>
                                            {testimonial.date && (
                                                <p className="text-gray-500 text-xs">{testimonial.date}</p>
                                            )}
                                        </div>
                                        <div className="ml-auto flex">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <span key={i} className="text-yellow-400 text-sm sm:text-base">⭐</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-xs sm:text-sm">{testimonial.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}