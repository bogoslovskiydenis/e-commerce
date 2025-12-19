import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export interface LoginDto {
    username: string;
    password: string;
    twoFactorCode?: string;
}
export interface AuthResult {
    user: any;
    token: string;
    refreshToken: string;
}
export declare class AuthService {
    private prisma;
    private jwtService;
    private config;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService);
    login(loginData: LoginDto): Promise<AuthResult>;
    private generateAccessToken;
    private generateRefreshToken;
    verifyToken(token: string): Promise<any>;
    refreshToken(refreshToken: string): Promise<AuthResult>;
    getUserById(id: string): Promise<any>;
}
