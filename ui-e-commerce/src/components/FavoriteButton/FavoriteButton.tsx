'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { apiService } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'

interface FavoriteButtonProps {
    productId: string
    size?: number
    className?: string
}

export default function FavoriteButton({ productId, size = 18, className = '' }: FavoriteButtonProps) {
    const { isAuthenticated } = useAuth()
    const [isFavorite, setIsFavorite] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (isAuthenticated) {
            checkFavorite()
        }
    }, [isAuthenticated, productId])

    const checkFavorite = async () => {
        try {
            const favorite = await apiService.isFavorite(productId)
            setIsFavorite(favorite)
        } catch (error) {
            console.error('Error checking favorite:', error)
        }
    }

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!isAuthenticated) {
            window.location.href = '/login'
            return
        }

        setIsLoading(true)
        try {
            if (isFavorite) {
                await apiService.removeFromFavorites(productId)
                setIsFavorite(false)
            } else {
                await apiService.addToFavorites(productId)
                setIsFavorite(true)
            }
        } catch (error) {
            console.error('Error toggling favorite:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className={`p-2 rounded-full border transition-colors ${
                isFavorite
                    ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                    : 'hover:bg-gray-50'
            } ${className}`}
            aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
            <Heart size={size} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
    )
}

