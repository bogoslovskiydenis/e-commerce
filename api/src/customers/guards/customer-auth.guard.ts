import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CustomerAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const decoded = this.jwtService.verify(token);
      
      if (decoded.type !== 'customer') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Используем raw query для получения клиента до перегенерации Prisma Client
      const customerResult = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT id, name, email, phone, address, notes, tags, metadata, is_active as "isActive",
                created_at as "createdAt", updated_at as "updatedAt"
         FROM customers WHERE id = $1::text AND is_active = true`,
        decoded.id
      );
      
      const customer = customerResult[0];

      if (!customer || !customer.isActive) {
        throw new UnauthorizedException('Customer not found or inactive');
      }

      request.customer = customer;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

