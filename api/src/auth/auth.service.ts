import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
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

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login(loginData: LoginDto): Promise<AuthResult> {
    const { username, password, twoFactorCode } = loginData;
    this.logger.log(`Attempting login for username: ${username}`);

    if (!password || password.trim().length === 0) {
      this.logger.warn(`Empty password provided for username: ${username}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email: username }],
      },
    });

    if (!user) {
      this.logger.warn(`User not found: ${username}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User found: ${user.username} (${user.id}), isActive: ${user.isActive}`);

    if (!user.isActive) {
      this.logger.warn(`Account is deactivated: ${username}`);
      throw new UnauthorizedException('Account is deactivated');
    }

    if (!user.passwordHash) {
      this.logger.error(`User ${user.username} has no password hash!`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.debug(`Comparing password for user: ${user.username}`);
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    this.logger.debug(`Password comparison result: ${isPasswordValid}`);
    
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for user: ${username}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.twoFactorEnabled && !twoFactorCode) {
      throw new UnauthorizedException('Two-factor authentication code required');
    }

    const token = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const { passwordHash, twoFactorSecret, ...safeUser } = user;

    return {
      user: safeUser,
      token,
      refreshToken,
    };
  }

  private generateAccessToken(user: any): string {
    return this.jwtService.sign({
      id: user.id,
      username: user.username,
      role: user.role,
      permissions: user.permissions || [],
    });
  }

  private generateRefreshToken(user: any): string {
    return this.jwtService.sign(
      { id: user.id },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET', 'your-refresh-secret-change-in-production'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '30d'),
      },
    );
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResult> {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET', 'your-refresh-secret-change-in-production'),
      }) as any;

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      const { passwordHash, twoFactorSecret, ...safeUser } = user;

      return {
        user: safeUser,
        token: newToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getUserById(id: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
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
        updatedAt: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }
}


