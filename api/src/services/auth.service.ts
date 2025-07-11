import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { config } from '../config';
import { ApiError } from '../utils/apiError';

export interface LoginData {
    username: string;
    password: string;
    twoFactorCode?: string;
}

export interface AuthResult {
    user: any;
    token: string;
    refreshToken: string;
}

export class AuthService {
    // Логин пользователя
    async login(loginData: LoginData): Promise<AuthResult> {
        const { username, password, twoFactorCode } = loginData;

        console.log('🔐 Login attempt:', { username });

        // Поиск пользователя
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: username },
                    { email: username }
                ]
            }
        });

        console.log('👤 User found:', user ?
            { id: user.id, username: user.username, email: user.email, active: user.isActive } :
            'NOT FOUND'
        );

        // Проверяем существование и активность пользователя
        if (!user) {
            console.log('❌ No user found with username/email:', username);
            throw ApiError.unauthorized('Invalid credentials');
        }

        if (!user.isActive) {
            console.log('❌ User is not active:', user.username);
            throw ApiError.unauthorized('Account is deactivated');
        }

        // Проверяем пароль
        console.log('🔐 Checking password...');
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        console.log('🔐 Password check result:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('❌ Invalid password for user:', user.username);
            throw ApiError.unauthorized('Invalid credentials');
        }

        // Проверяем 2FA если включен
        if (user.twoFactorEnabled) {
            if (!twoFactorCode) {
                throw ApiError.badRequest('Two-factor authentication code required');
            }

            // Здесь должна быть проверка 2FA кода
            // const isValid2FA = await this.verify2FA(user.twoFactorSecret, twoFactorCode);
            // if (!isValid2FA) {
            //     throw ApiError.unauthorized('Invalid two-factor code');
            // }
        }

        // Создаем токены
        const token = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);

        // Обновляем последний вход
        await prisma.user.update({
            where: { id: user.id },
            data: {
                lastLogin: new Date(),
                lastLoginIp: user.lastLoginIp || 'unknown' // Сохраняем IP если есть
            }
        });

        // Убираем чувствительные данные
        const { passwordHash, twoFactorSecret, ...safeUser } = user;

        console.log('✅ Login successful for user:', user.username);

        return {
            user: safeUser,
            token,
            refreshToken
        };
    }

    // Генерация access токена
    private generateAccessToken(user: any): string {
        return jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                permissions: user.permissions || []
            },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn }
        );
    }

    // Генерация refresh токена
    private generateRefreshToken(user: any): string {
        return jwt.sign(
            { id: user.id },
            config.jwtRefreshSecret,
            { expiresIn: config.jwtRefreshExpiresIn }
        );
    }

    // Верификация токена
    async verifyToken(token: string): Promise<any> {
        try {
            const decoded = jwt.verify(token, config.jwtSecret);
            return decoded;
        } catch (error) {
            throw ApiError.unauthorized('Invalid token');
        }
    }

    // Обновление токена
    async refreshToken(refreshToken: string): Promise<AuthResult> {
        try {
            const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as any;

            const user = await prisma.user.findUnique({
                where: { id: decoded.id }
            });

            if (!user || !user.isActive) {
                throw ApiError.unauthorized('Invalid refresh token');
            }

            const newToken = this.generateAccessToken(user);
            const newRefreshToken = this.generateRefreshToken(user);

            const { passwordHash, twoFactorSecret, ...safeUser } = user;

            return {
                user: safeUser,
                token: newToken,
                refreshToken: newRefreshToken
            };

        } catch (error) {
            throw ApiError.unauthorized('Invalid refresh token');
        }
    }

    // Получение пользователя по токену
    async getUserByToken(token: string): Promise<any> {
        const decoded = await this.verifyToken(token);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                username: true,
                email: true,
                fullName: true,
                role: true,
                permissions: true,
                isActive: true,
                twoFactorEnabled: true,
                lastLogin: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user || !user.isActive) {
            throw ApiError.unauthorized('User not found or inactive');
        }

        return user;
    }
}