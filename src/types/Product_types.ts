export interface Product {
    id: string;
    title: string;
    brand: string;
    price: number;
    oldPrice: number | null;  // Явно указываем, что oldPrice может быть null
    discount: number;
    image: string;
    category: string;
    link: string;
}