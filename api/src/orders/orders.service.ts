import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  async createOrder(data: any) {
    const { customer, items, shippingAddress, notes } = data;

    if (!customer || !customer.name || !customer.phone) {
      throw new BadRequestException('Customer name and phone are required');
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('Order items are required');
    }

    // Найти или создать клиента
    let customerRecord = await this.prisma.customer.findUnique({
      where: { phone: customer.phone },
    });

    // Если не найден по телефону и есть email, искать по email
    if (!customerRecord && customer.email) {
      customerRecord = await this.prisma.customer.findUnique({
        where: { email: customer.email },
      });
    }

    if (!customerRecord) {
      // Проверить, не занят ли email другим клиентом
      if (customer.email) {
        const existingByEmail = await this.prisma.customer.findUnique({
          where: { email: customer.email },
        });
        if (existingByEmail) {
          throw new BadRequestException('Email уже используется другим клиентом');
        }
      }

      customerRecord = await this.prisma.customer.create({
        data: {
          name: customer.name,
          phone: customer.phone,
          email: customer.email || null,
          address: shippingAddress ? JSON.stringify(shippingAddress) : null,
        },
      });
    } else {
      // Обновить данные клиента, если они изменились
      const updateData: any = {};
      if (customer.email && customer.email !== customerRecord.email) {
        // Проверить, не занят ли новый email другим клиентом
        const existingByEmail = await this.prisma.customer.findUnique({
          where: { email: customer.email },
        });
        if (existingByEmail && existingByEmail.id !== customerRecord.id) {
          // Email занят другим клиентом, не обновляем
          console.warn(`Email ${customer.email} уже используется другим клиентом`);
        } else {
          updateData.email = customer.email;
        }
      }
      if (shippingAddress) {
        updateData.address = JSON.stringify(shippingAddress);
      }
      if (customer.name && customer.name !== customerRecord.name) {
        updateData.name = customer.name;
      }
      if (Object.keys(updateData).length > 0) {
        customerRecord = await this.prisma.customer.update({
          where: { id: customerRecord.id },
          data: updateData,
        });
      }
    }

    // Вычислить суммы
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      if (!item.productId || !item.quantity || !item.price) {
        throw new BadRequestException('Invalid order item data');
      }

      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }

      const itemTotal = Number(item.price) * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.price),
        total: itemTotal,
      });
    }

    // Генерировать номер заказа
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Создать заказ
    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        customerId: customerRecord.id,
        status: 'NEW',
        paymentStatus: 'PENDING',
        paymentMethod: 'CASH',
        totalAmount,
        discountAmount: 0,
        shippingAmount: 0,
        shippingAddress: shippingAddress ? shippingAddress : null,
        notes: notes || null,
        source: 'website',
        items: {
          create: orderItems,
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: true,
              },
            },
          },
        },
      },
    });

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
