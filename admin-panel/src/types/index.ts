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


export interface Banner {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    image: string;
    mobileImage?: string;
    buttonText?: string;
    buttonUrl?: string;
    position: 'main' | 'category' | 'sidebar' | 'promo';
    active: boolean;
    order: number;
    startDate?: string;
    endDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PageContent {
    id: string;
    slug: string;
    title: string;
    content: string;
    excerpt?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    active: boolean;
    template?: 'default' | 'full-width' | 'sidebar';
    createdAt: string;
    updatedAt: string;
}

export interface SiteSettings {
    id: string;
    // Основные настройки
    siteName: string;
    siteDescription: string;
    siteKeywords?: string;
    logo?: string;
    favicon?: string;

    // Дизайн
    primaryColor: string;
    secondaryColor: string;
    accentColor?: string;
    fontFamily?: string;

    // Контактная информация
    phone: string;
    alternativePhone?: string;
    email: string;
    supportEmail?: string;
    address: string;
    workingHours: string;

    // Социальные сети
    socialMedia: {
        facebook?: string;
        instagram?: string;
        telegram?: string;
        viber?: string;
        youtube?: string;
        tiktok?: string;
    };

    // SEO и аналитика
    googleAnalytics?: string;
    googleTagManager?: string;
    facebookPixel?: string;
    yandexMetrica?: string;

    // Настройки доставки
    deliverySettings: {
        freeDeliveryFrom?: number;
        deliveryPrice?: number;
        deliveryTime?: string;
        deliveryInfo?: string;
    };

    // Настройки платежей
    paymentMethods: string[];

    updatedAt: string;
}

export interface MenuItem {
    id: string;
    title: string;
    url: string;
    type: 'page' | 'category' | 'external' | 'custom';
    parentId?: string;
    order: number;
    active: boolean;
    target?: '_self' | '_blank';
    cssClass?: string;
    icon?: string;
}

export interface NavigationMenu {
    id: string;
    name: string;
    location: 'header' | 'footer' | 'sidebar' | 'mobile';
    items: MenuItem[];
    active: boolean;
}

export interface HomePageSettings {
    id: string;
    // Hero секция
    heroTitle: string;
    heroSubtitle?: string;
    heroButtonText?: string;
    heroButtonUrl?: string;
    heroBackgroundImage?: string;

    // Секции на главной
    showFeaturedProducts: boolean;
    featuredProductsTitle?: string;
    showCategories: boolean;
    categoriesTitle?: string;
    showTestimonials: boolean;
    testimonialsTitle?: string;
    showFeatures: boolean;

    // Блоки преимуществ
    features: {
        id: string;
        title: string;
        description: string;
        icon?: string;
        active: boolean;
        order: number;
    }[];

    updatedAt: string;
}

export interface Testimonial {
    id: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
    rating: number;
    productId?: string;
    active: boolean;
    featured: boolean;
    createdAt: string;
}




export {};