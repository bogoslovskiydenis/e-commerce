import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async getCustomers(query: any) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: { select: { orders: true, reviews: true, callbacks: true } },
        },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return {
      success: true,
      data: customers,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    };
  }

  async getCustomerById(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        orders: { orderBy: { createdAt: 'desc' }, take: 10 },
        reviews: { orderBy: { createdAt: 'desc' }, take: 5 },
        callbacks: { orderBy: { createdAt: 'desc' }, take: 5 },
        _count: { select: { orders: true, reviews: true, callbacks: true } },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return { success: true, data: customer };
  }

  async createCustomer(data: any) {
    if (!data.name || !data.phone) {
      throw new BadRequestException('Name and phone are required');
    }

    const customer = await this.prisma.customer.create({
      data: { ...data, tags: data.tags || [], isActive: true },
    });

    return { success: true, data: customer };
  }

  async updateCustomer(id: string, data: any) {
    const customer = await this.prisma.customer.update({
      where: { id },
      data,
    });

    return { success: true, data: customer };
  }

  async deleteCustomer(id: string) {
    await this.prisma.customer.delete({ where: { id } });
    return { success: true, message: 'Customer deleted successfully' };
  }
}
