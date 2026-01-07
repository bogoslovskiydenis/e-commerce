import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async getComments(query: any) {
    const { page = 1, limit = 25, search, isApproved, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isApproved !== undefined) {
      where.isApproved = isApproved === 'true' || isApproved === true;
    }

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: sortOrder },
        include: {
          moderator: { select: { id: true, username: true, fullName: true } },
        },
      }),
      this.prisma.comment.count({ where }),
    ]);

    return {
      success: true,
      data: comments,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    };
  }

  async getCommentById(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        moderator: { select: { id: true, username: true, fullName: true } },
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return { success: true, data: comment };
  }

  async createComment(data: any) {
    const { name, email, message } = data;

    if (!name || !email || !message) {
      throw new BadRequestException('Name, email and message are required');
    }

    const comment = await this.prisma.comment.create({
      data: {
        name,
        email,
        message,
        isApproved: false, // По умолчанию не одобрен
      },
      include: {
        moderator: { select: { id: true, username: true, fullName: true } },
      },
    });

    return { success: true, data: comment };
  }

  async updateComment(id: string, data: any, moderatorId?: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.message !== undefined) updateData.message = data.message;
    
    // Устанавливаем moderatorId только при изменении статуса одобрения
    if (data.isApproved !== undefined) {
      updateData.isApproved = data.isApproved === true || data.isApproved === 'true';
      if (moderatorId && updateData.isApproved) {
        updateData.moderatorId = moderatorId;
      }
    }

    const updated = await this.prisma.comment.update({
      where: { id },
      data: updateData,
      include: {
        moderator: { select: { id: true, username: true, fullName: true } },
      },
    });

    return { success: true, data: updated };
  }

  async deleteComment(id: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.prisma.comment.delete({ where: { id } });
    return { success: true, message: 'Comment deleted successfully' };
  }
}

