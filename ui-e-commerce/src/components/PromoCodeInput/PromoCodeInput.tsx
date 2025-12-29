'use client'

import { useState } from 'react'
import { Tag, X, CheckCircle2, AlertCircle } from 'lucide-react'
import { apiService } from '@/services/api'
import { cartUtils, AppliedPromotion } from '@/utils/cart'

interface PromoCodeInputProps {
    onPromotionApplied?: (promotion: AppliedPromotion | null) => void
    className?: string
}

export default function PromoCodeInput({ onPromotionApplied, className = '' }: PromoCodeInputProps) {
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [appliedPromotion, setAppliedPromotion] = useState<AppliedPromotion | null>(null)

    const handleApply = async () => {
        if (!code.trim()) {
            setError('Введите промокод')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const promotion = await apiService.getPromotionByCode(code.trim().toUpperCase())
            
            if (!promotion) {
                setError('Промокод не найден')
                return
            }

            const appliedPromo: AppliedPromotion = {
                id: promotion.id,
                code: promotion.code ? promotion.code.trim().toUpperCase() : '',
                type: promotion.type,
                value: Number(promotion.value),
                productIds: promotion.products?.map(p => p.product.id)
            }

            setAppliedPromotion(appliedPromo)
            setCode('')
            onPromotionApplied?.(appliedPromo)
        } catch (err: any) {
            setError(err.data?.message || err.message || 'Ошибка применения промокода')
        } finally {
            setLoading(false)
        }
    }

    const handleRemove = () => {
        setAppliedPromotion(null)
        setCode('')
        setError(null)
        onPromotionApplied?.(null)
    }

    if (appliedPromotion) {
        return (
            <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="text-green-600" size={20} />
                        <div>
                            <p className="text-sm font-medium text-green-900">
                                Промокод {appliedPromotion.code} применен
                            </p>
                            <p className="text-xs text-green-700">
                                {appliedPromotion.type === 'PERCENTAGE' && `Скидка ${appliedPromotion.value}%`}
                                {appliedPromotion.type === 'FIXED_AMOUNT' && `Скидка ${appliedPromotion.value} грн`}
                                {appliedPromotion.type === 'FREE_SHIPPING' && 'Бесплатная доставка'}
                                {appliedPromotion.type === 'BUY_ONE_GET_ONE' && 'Купи один - получи второй'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleRemove}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        aria-label="Удалить промокод"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Промокод
            </label>
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value.toUpperCase())
                            setError(null)
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && handleApply()}
                        placeholder="Введите промокод"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        disabled={loading}
                    />
                </div>
                <button
                    onClick={handleApply}
                    disabled={loading || !code.trim()}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {loading ? '...' : 'Применить'}
                </button>
            </div>
            {error && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}
        </div>
    )
}

