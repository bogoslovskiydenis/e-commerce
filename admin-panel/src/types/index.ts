export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    createdAt: string;
}

export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
}

export interface Order {
    id: string;
    createdAt: string;
    customer: Customer;
    items: OrderItem[];
    totalAmount: number;
    itemsCount: number;
    status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'paid' | 'pending' | 'failed';
    paymentMethod?: string;
    paymentNote?: string;
    deliveryMethod?: string;
    deliveryAddress?: string;
    source?: string;
    comment?: string;
    commentCustomer?: string;
    manager?: string;
}

export interface Product {
    id: string;
    brand?: string;
    title: string;
    price: number;
    oldPrice?: number;
    discount?: number;}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    createdAt: string;
}

export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
}

export interface Order {
    id: string;
    createdAt: string;
    customer: Customer;
    items: OrderItem[];
    totalAmount: number;
    itemsCount: number;
    status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'paid' | 'pending' | 'failed';
    paymentMethod?: string;
    paymentNote?: string;
    deliveryMethod?: string;
    deliveryAddress?: string;
    source?: string;
    comment?: string;
    commentCustomer?: string;
    manager?: string;
}

export interface Comment {
    id: string;
    subject: string;
    content: string;
    status: 'new' | 'approved' | 'rejected' | 'spam';
    type: 'comment' | 'review';
    author: {
        name: string;
        email: string;
        phone?: string;
    };
    user?: {
        name: string;
        role: string;
    };
    recordType: string;
    recordId: string;
    template?: string;
    isVisible: boolean;
    moderatorNote?: string;
    createdAt: string;
}

export interface CallbackRequest {
    id: string;
    name: string;
    phone: string;
    email?: string;
    status: 'new' | 'in_progress' | 'completed' | 'cancelled';
    url?: string;
    callbackTime?: string;
    manager?: string;
    comment?: string;
    managerNote?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    createdAt: string;
}

export interface Product {
    id: string;
    brand?: string;
    title: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    category: string;
    categoryId: string;
    image?: string;
    description?: string;
    inStock: boolean;
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
}

export interface Discount {
    id: string;
    name: string;
    code?: string;
    value: number;
    type: 'percentage' | 'fixed';
    startDate?: string;
    endDate?: string;
    minOrderAmount?: number;
    usageLimit?: number;
    active: boolean;
    description?: string;
}

export {};