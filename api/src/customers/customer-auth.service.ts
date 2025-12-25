import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

export interface CustomerRegisterDto {
  name: string;
  email?: string;
  phone: string;
  password: string;
  address?: string;
}

export interface CustomerLoginDto {
  phoneOrEmail: string;
  password: string;
}

export interface CustomerAuthResult {
  customer: any;
  token: string;
  refreshToken: string;
}

@Injectable()
export class CustomerAuthService {
  private isColumnChecked = false;
  private columnCheckPromise: Promise<void> | null = null;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {
    // Инициализируем проверку колонки асинхронно
    this.columnCheckPromise = this.ensurePasswordHashColumn();
  }

  private async ensurePasswordHashColumn(): Promise<void> {
    if (this.isColumnChecked) return;
    
    try {
      // Проверяем наличие колонки password_hash
      const result = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT column_name 
         FROM information_schema.columns 
         WHERE table_name = 'customers' AND column_name = 'password_hash'`
      );
      
      if (result.length === 0) {
        // Колонка не существует, создаем её
        await this.prisma.$executeRawUnsafe(
          `ALTER TABLE customers ADD COLUMN IF NOT EXISTS password_hash TEXT`
        );
        
        // Создаем уникальные индексы для email и phone, если их нет
        try {
          await this.prisma.$executeRawUnsafe(
            `CREATE UNIQUE INDEX IF NOT EXISTS customers_email_key ON customers(email) WHERE email IS NOT NULL`
          );
        } catch (e) {
          // Индекс может уже существовать
        }
        
        try {
          await this.prisma.$executeRawUnsafe(
            `CREATE UNIQUE INDEX IF NOT EXISTS customers_phone_key ON customers(phone)`
          );
        } catch (e) {
          // Индекс может уже существовать
        }
      }
      
      this.isColumnChecked = true;
    } catch (error) {
      console.error('Error ensuring password_hash column:', error);
      // Продолжаем работу, возможно колонка уже существует
      this.isColumnChecked = true;
    }
  }

  async register(data: CustomerRegisterDto): Promise<CustomerAuthResult> {
    // Убеждаемся, что колонка существует
    if (this.columnCheckPromise) {
      await this.columnCheckPromise;
    } else {
      await this.ensurePasswordHashColumn();
    }
    
    const { name, email, phone, password, address } = data;

    // Проверка существующего клиента
    const existingCustomer = await this.prisma.customer.findFirst({
      where: {
        OR: [
          email ? { email } : undefined,
          { phone },
        ].filter(Boolean),
      },
    });

    if (existingCustomer) {
      if (email && existingCustomer.email === email) {
        throw new ConflictException('Користувач з таким email вже зареєстрований');
      }
      if (existingCustomer.phone === phone) {
        throw new ConflictException('Користувач з таким телефоном вже зареєстрований');
      }
    }

    // Хеширование пароля
    const passwordHash = await bcrypt.hash(password, 10);

    // Создание клиента
    // Используем $executeRawUnsafe для создания клиента с passwordHash до перегенерации Prisma Client
    const customerId = crypto.randomUUID();
    await this.prisma.$executeRawUnsafe(
      `INSERT INTO customers (id, name, email, phone, password_hash, address, is_active, created_at, updated_at, tags)
       VALUES ($1::text, $2, $3, $4, $5, $6, true, NOW(), NOW(), '{}'::text[])`,
      customerId,
      name,
      email || null,
      phone,
      passwordHash,
      address || null
    );
    
    // Получаем созданного клиента через raw query, так как Prisma Client еще не знает о passwordHash
    const customerResult = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id, name, email, phone, address, notes, tags, metadata, is_active as "isActive", 
              created_at as "createdAt", updated_at as "updatedAt"
       FROM customers WHERE id = $1::text`,
      customerId
    );
    
    const customer = customerResult[0];
    if (!customer) {
      throw new BadRequestException('Failed to create customer');
    }

    const token = this.generateAccessToken(customer);
    const refreshToken = this.generateRefreshToken(customer);

    return {
      customer: customer,
      token,
      refreshToken,
    };
  }

  async login(loginData: CustomerLoginDto): Promise<CustomerAuthResult> {
    const { phoneOrEmail, password } = loginData;

    // Используем raw query для получения passwordHash до перегенерации Prisma Client
    const customerResult = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id, name, email, phone, address, notes, tags, metadata, is_active as "isActive",
              password_hash as "passwordHash", created_at as "createdAt", updated_at as "updatedAt"
       FROM customers 
       WHERE (phone = $1 OR email = $1) AND is_active = true
       LIMIT 1`,
      phoneOrEmail
    );
    
    const customer = customerResult[0];

    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!customer.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    if (!customer.passwordHash) {
      throw new UnauthorizedException('Account not registered. Please register first.');
    }

    const isPasswordValid = await bcrypt.compare(password, customer.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateAccessToken(customer);
    const refreshToken = this.generateRefreshToken(customer);

    // Удаляем passwordHash из ответа
    const { passwordHash: _, ...safeCustomer } = customer;

    return {
      customer: safeCustomer,
      token,
      refreshToken,
    };
  }

  private generateAccessToken(customer: any): string {
    return this.jwtService.sign({
      id: customer.id,
      phone: customer.phone,
      type: 'customer',
    });
  }

  private generateRefreshToken(customer: any): string {
    return this.jwtService.sign(
      { id: customer.id, type: 'customer' },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET', 'your-refresh-secret-change-in-production'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '30d'),
      },
    );
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      if (decoded.type !== 'customer') {
        throw new UnauthorizedException('Invalid token type');
      }
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async refreshToken(refreshToken: string): Promise<CustomerAuthResult> {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET', 'your-refresh-secret-change-in-production'),
      }) as any;

      if (decoded.type !== 'customer') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Используем raw query для получения passwordHash до перегенерации Prisma Client
      const customerResult = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT id, name, email, phone, address, notes, tags, metadata, is_active as "isActive",
                password_hash as "passwordHash", created_at as "createdAt", updated_at as "updatedAt"
         FROM customers WHERE id = $1::text AND is_active = true`,
        decoded.id
      );
      
      const customer = customerResult[0];

      if (!customer || !customer.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newToken = this.generateAccessToken(customer);
      const newRefreshToken = this.generateRefreshToken(customer);

      // Удаляем passwordHash из ответа
      const { passwordHash: _, ...safeCustomer } = customer;

      return {
        customer: safeCustomer,
        token: newToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getCustomerById(id: string): Promise<any> {
    // Получаем основную информацию о клиенте
    const customerResult = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id, name, email, phone, address, notes, tags, metadata, is_active as "isActive",
              created_at as "createdAt", updated_at as "updatedAt"
       FROM customers WHERE id = $1::text AND is_active = true`,
      id
    );
    
    const customer = customerResult[0];

    if (!customer) {
      throw new UnauthorizedException('Customer not found or inactive');
    }

    // Получаем заказы клиента
    const orders = await this.prisma.order.findMany({
      where: { customerId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: true,
                price: true,
              },
            },
          },
        },
      },
    });

    // Получаем счетчики
    const [ordersCount, reviewsCount] = await Promise.all([
      this.prisma.order.count({ where: { customerId: id } }),
      this.prisma.review.count({ where: { customerId: id } }),
    ]);

    return {
      ...customer,
      orders,
      _count: {
        orders: ordersCount,
        reviews: reviewsCount,
      },
    };
  }
}

