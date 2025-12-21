import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CallbackStatus, CallbackPriority } from '@prisma/client';

@Injectable()
export class CallbacksService {
  constructor(private prisma: PrismaService) {}

  async getCallbacks(query: any) {
    const { page = 1, limit = 25, search, status, priority, managerId, dateFrom, dateTo, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (managerId) where.managerId = managerId;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const [callbacks, total] = await Promise.all([
      this.prisma.callback.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: sortOrder },
        include: {
          customer: { select: { id: true, name: true, email: true, phone: true } },
          manager: { select: { id: true, username: true, fullName: true } },
        },
      }),
      this.prisma.callback.count({ where }),
    ]);

    return {
      success: true,
      data: callbacks,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    };
  }

  async getCallbackById(id: string) {
    const callback = await this.prisma.callback.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true } },
        manager: { select: { id: true, username: true, fullName: true } },
      },
    });

    if (!callback) {
      throw new NotFoundException('Callback not found');
    }

    return { success: true, data: callback };
  }

  async createCallback(data: any) {
    const { customerId, name, phone, email, message, status, priority, source, scheduledAt } = data;

    if (!name || !phone) {
      throw new BadRequestException('Name and phone are required');
    }

    const callback = await this.prisma.callback.create({
      data: {
        customerId: customerId || null,
        name,
        phone,
        email: email || null,
        message: message || null,
        status: status || CallbackStatus.NEW,
        priority: priority || CallbackPriority.MEDIUM,
        source: source || 'website',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true } },
        manager: { select: { id: true, username: true, fullName: true } },
      },
    });

    return { success: true, data: callback };
  }

  async updateCallback(id: string, data: any) {
    const callback = await this.prisma.callback.findUnique({ where: { id } });
    if (!callback) {
      throw new NotFoundException('Callback not found');
    }

    const updateData: any = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.managerId !== undefined) updateData.managerId = data.managerId || null;
    if (data.scheduledAt !== undefined) updateData.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.message !== undefined) updateData.message = data.message;

    if (data.status === CallbackStatus.COMPLETED && !callback.completedAt) {
      updateData.completedAt = new Date();
    }

    const updated = await this.prisma.callback.update({
      where: { id },
      data: updateData,
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true } },
        manager: { select: { id: true, username: true, fullName: true } },
      },
    });

    return { success: true, data: updated };
  }

  async deleteCallback(id: string) {
    const callback = await this.prisma.callback.findUnique({ where: { id } });
    if (!callback) {
      throw new NotFoundException('Callback not found');
    }

    await this.prisma.callback.delete({ where: { id } });
    return { success: true, message: 'Callback deleted successfully' };
  }
}


