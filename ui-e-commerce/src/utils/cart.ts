export interface CartItem {
    id: string
    name: string
    price: number
    image: string
    quantity: number
    productId?: string
    attributes?: {
        color?: string
        size?: string
        withHelium?: boolean
    }
}

export interface AppliedPromotion {
    id: string
    code: string
    type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' | 'BUY_ONE_GET_ONE'
    value: number
    productIds?: string[]
}

const CART_KEY = 'cart'

export const cartUtils = {
    // Получить все товары из корзины
    getCart(): CartItem[] {
        if (typeof window === 'undefined') return []
        try {
            const cart = localStorage.getItem(CART_KEY)
            return cart ? JSON.parse(cart) : []
        } catch (error) {
            console.error('Error loading cart:', error)
            return []
        }
    },

    // Добавить товар в корзину
    addToCart(item: Omit<CartItem, 'quantity'> & { quantity?: number }): void {
        if (typeof window === 'undefined') return
        
        const cart = this.getCart()
        const existingItem = cart.find(
            (cartItem) => 
                cartItem.id === item.id &&
                cartItem.attributes?.color === item.attributes?.color &&
                cartItem.attributes?.size === item.attributes?.size &&
                cartItem.attributes?.withHelium === item.attributes?.withHelium
        )

        if (existingItem) {
            // Если товар уже есть, увеличиваем количество
            existingItem.quantity += item.quantity || 1
        } else {
            // Добавляем новый товар
            cart.push({
                ...item,
                quantity: item.quantity || 1
            })
        }

        localStorage.setItem(CART_KEY, JSON.stringify(cart))
        
        // Вызываем событие для обновления UI
        window.dispatchEvent(new Event('cartUpdated'))
    },

    // Удалить товар из корзины
    removeFromCart(itemId: string, attributes?: CartItem['attributes']): void {
        if (typeof window === 'undefined') return
        
        const cart = this.getCart()
        const filtered = cart.filter((item) => {
            if (item.id !== itemId) return true
            if (!attributes) return false
            
            return (
                item.attributes?.color !== attributes.color ||
                item.attributes?.size !== attributes.size ||
                item.attributes?.withHelium !== attributes.withHelium
            )
        })

        localStorage.setItem(CART_KEY, JSON.stringify(filtered))
        window.dispatchEvent(new Event('cartUpdated'))
    },

    // Обновить количество товара
    updateQuantity(itemId: string, quantity: number, attributes?: CartItem['attributes']): void {
        if (typeof window === 'undefined') return
        
        const cart = this.getCart()
        const item = cart.find((cartItem) => {
            if (cartItem.id !== itemId) return false
            if (!attributes) return true
            
            return (
                cartItem.attributes?.color === attributes.color &&
                cartItem.attributes?.size === attributes.size &&
                cartItem.attributes?.withHelium === attributes.withHelium
            )
        })

        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(itemId, attributes)
            } else {
                item.quantity = quantity
                localStorage.setItem(CART_KEY, JSON.stringify(cart))
                window.dispatchEvent(new Event('cartUpdated'))
            }
        }
    },

    // Очистить корзину
    clearCart(): void {
        if (typeof window === 'undefined') return
        localStorage.removeItem(CART_KEY)
        window.dispatchEvent(new Event('cartUpdated'))
    },

    // Получить количество товаров в корзине
    getCartCount(): number {
        const cart = this.getCart()
        return cart.reduce((sum, item) => sum + item.quantity, 0)
    },

    // Получить общую сумму корзины
    getCartTotal(): number {
        const cart = this.getCart()
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },

    // Рассчитать скидку
    calculateDiscount(subtotal: number, promotion: AppliedPromotion | null, cartItems: CartItem[]): number {
        if (!promotion) return 0

        let discount = 0
        const applicableItems = promotion.productIds && promotion.productIds.length > 0
            ? cartItems.filter(item => promotion.productIds!.includes(item.productId || item.id))
            : cartItems

        const applicableSubtotal = applicableItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

        if (promotion.minOrderAmount && subtotal < promotion.minOrderAmount) {
            return 0
        }

        switch (promotion.type) {
            case 'PERCENTAGE':
                discount = (applicableSubtotal * promotion.value) / 100
                break
            case 'FIXED_AMOUNT':
                discount = Math.min(promotion.value, applicableSubtotal)
                break
            case 'FREE_SHIPPING':
                discount = 0
                break
            case 'BUY_ONE_GET_ONE':
                discount = 0
                break
        }

        return Math.round(discount * 100) / 100
    }
}
