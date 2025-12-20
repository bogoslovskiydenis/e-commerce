import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async getOrders(query: any) {
    const { page = 1, limit = 25, search, status, paymentStatus, dateFrom, dateTo, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { customer: { phone: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    // Маппинг полей сортировки: 'date' -> 'createdAt'
    const sortField = sortBy === 'date' ? 'createdAt' : sortBy;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          customer: true,
          manager: { select: { id: true, fullName: true, username: true } },
          items: { include: { product: { select: { id: true, title: true, images: true } } } },
        },
        orderBy: { [sortField]: sortOrder },
        skip,
        take: Number(limit),
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      success: true,
      data: orders,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    };
  }

  async getOrderById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        manager: { select: { id: true, fullName: true, username: true } },
        items: { include: { product: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return { success: true, data: order };
  }

  async updateOrderStatus(id: string, data: any, userId: string) {
    const updateData: any = {};
    if (data.status) updateData.status = data.status;
    if (data.paymentStatus) updateData.paymentStatus = data.paymentStatus;
    if (data.managerNotes) updateData.managerNotes = data.managerNotes;
    if (userId) updateData.managerId = userId;

    const order = await this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        manager: { select: { id: true, fullName: true } },
      },
    });

    return { success: true, data: order };
  }
}
