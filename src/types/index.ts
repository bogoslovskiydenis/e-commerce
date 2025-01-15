export interface Product {
    id: string
    title: string
    brand: string
    price: number
    oldPrice?: number
    discount?: number
    image: string
    category: string
}
