export interface Product {
    id: string
    brand: string
    title: string
    price: number
    oldPrice: number | null
    discount: number
    image: string
    link: string
}

export interface Category {
    name: string
    count: number
}

export interface SortOption {
    value: string
    label: string
}