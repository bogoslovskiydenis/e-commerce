import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { config } from '../config';

// Генерация случайной строки
export function generateRandomString(length: number): string {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
}

// Генерация API ключа
export function generateApiKey(): string {
    const prefix = 'bs_'; // balloon shop
    const randomPart = generateRandomString(32);
    return `${prefix}${randomPart}`;
}

// Хеширование пароля
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.bcryptRounds);
}

// Проверка пароля
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// Генерация slug из строки
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Удаляем специальные символы
        .replace(/[\s_-]+/g, '-') // Заменяем пробелы и подчеркивания на дефисы
        .replace(/^-+|-+$/g, ''); // Удаляем дефисы в начале и конце
}

// Форматирование номера телефона
export function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 10) {
        return `+38${cleaned}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('38')) {
        return `+${cleaned}`;
    }

    return phone;
}

// Валидация email
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Генерация номера заказа
export function generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BS${timestamp.slice(-6)}${random}`;
}

// Расчет скидки
export function calculateDiscount(price: number, discount: number, type: 'percentage' | 'fixed'): number {
    if (type === 'percentage') {
        return price * (discount / 100);
    }
    return Math.min(discount, price);
}

// Форматирование суммы
export function formatCurrency(amount: number, currency = 'UAH'): string {
    return new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}