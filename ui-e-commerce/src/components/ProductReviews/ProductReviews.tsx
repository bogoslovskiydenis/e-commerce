'use client'

import { useState, useEffect } from 'react'
import { Star, Send, User } from 'lucide-react'
import { apiService, Review } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/contexts/LanguageContext'

interface ProductReviewsProps {
    productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const { t } = useTranslation()
    const { customer, isAuthenticated } = useAuth()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [averageRating, setAverageRating] = useState(0)
    const [ratingCounts, setRatingCounts] = useState<Record<number, number>>({})

    const [formData, setFormData] = useState({
        name: customer?.name || '',
        email: customer?.email || '',
        rating: 5,
        comment: '',
    })

    useEffect(() => {
        loadReviews()
    }, [productId, page])

    useEffect(() => {
        if (customer) {
            setFormData(prev => ({
                ...prev,
                name: customer.name || '',
                email: customer.email || '',
            }))
        }
    }, [customer])

    const loadReviews = async () => {
        try {
            setLoading(true)
            const data = await apiService.getProductReviews(productId, { page, limit: 10 })
            setReviews(data.reviews)
            setTotalPages(data.pagination.pages || 1)

            // Рассчитываем средний рейтинг и количество по рейтингам
            if (data.reviews.length > 0) {
                const total = data.reviews.reduce((sum, r) => sum + r.rating, 0)
                const avg = total / data.reviews.length
                setAverageRating(avg)

                const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                data.reviews.forEach(r => {
                    counts[r.rating] = (counts[r.rating] || 0) + 1
                })
                setRatingCounts(counts)
            }
        } catch (error) {
            console.error('Error loading reviews:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name.trim() || !formData.rating) {
            return
        }

        setSubmitting(true)
        try {
            await apiService.createReview({
                productId,
                customerId: customer?.id,
                name: formData.name.trim(),
                email: formData.email.trim() || undefined,
                rating: formData.rating,
                comment: formData.comment.trim() || undefined,
            })

            // Сброс формы
            setFormData({
                name: customer?.name || '',
                email: customer?.email || '',
                rating: 5,
                comment: '',
            })
            setShowForm(false)

            // Перезагрузка отзывов
            await loadReviews()
        } catch (error: any) {
            console.error('Error creating review:', error)
            alert(error.message || t('reviews.error'))
        } finally {
            setSubmitting(false)
        }
    }

    const renderStars = (rating: number, size: number = 16) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={size}
                        className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                    />
                ))}
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const locale = t('languages.uk') === 'Українська' ? 'uk-UA' : t('languages.ru') === 'Русский' ? 'ru-RU' : 'en-US'
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    return (
        <div className="mt-12 border-t pt-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{t('reviews.title')}</h2>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                        {t('reviews.writeReview')}
                    </button>
                )}
            </div>

            {/* Статистика отзывов */}
            {reviews.length > 0 && (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-6 mb-4">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                            <div className="mt-1">{renderStars(Math.round(averageRating), 20)}</div>
                            <div className="text-sm text-gray-600 mt-1">
                                {reviews.length} {reviews.length === 1 ? t('reviews.review') : t('reviews.reviews')}
                            </div>
                        </div>
                        <div className="flex-1">
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const count = ratingCounts[rating] || 0
                                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                                return (
                                    <div key={rating} className="flex items-center gap-3 mb-2">
                                        <div className="flex items-center gap-1 w-20">
                                            <span className="text-sm font-medium">{rating}</span>
                                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                        </div>
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-400"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Форма добавления отзыва */}
            {showForm && (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">{t('reviews.leaveReview')}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('reviews.rating')} <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating })}
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            size={32}
                                            className={
                                                rating <= formData.rating
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-300'
                                            }
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('reviews.name')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('reviews.email')}
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('reviews.comment')}
                            </label>
                            <textarea
                                value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                placeholder={t('reviews.commentPlaceholder')}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Send size={18} />
                                {submitting ? t('reviews.submitting') : t('reviews.submit')}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false)
                                    setFormData({
                                        name: customer?.name || '',
                                        email: customer?.email || '',
                                        rating: 5,
                                        comment: '',
                                    })
                                }}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {t('reviews.cancel')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Список отзывов */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t('reviews.loading')}</p>
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <User size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">{t('reviews.noReviews')}</p>
                    <p className="text-sm text-gray-500">{t('reviews.beFirst')}</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                                        <User size={20} className="text-teal-600" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{review.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {formatDate(review.createdAt)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {renderStars(review.rating)}
                                </div>
                            </div>
                            {review.comment && (
                                <p className="text-gray-700 leading-relaxed ml-[52px]">{review.comment}</p>
                            )}
                        </div>
                    ))}

                    {/* Пагинация */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Попередня
                            </button>
                            <span className="px-4 py-2 text-gray-700">
                                Сторінка {page} з {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Наступна
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

