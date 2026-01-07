import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get('public')
  async getPublicComments(@Query() query: any) {
    // Публичный endpoint - возвращает только одобренные комментарии
    const result = await this.commentsService.getComments({ ...query, isApproved: true });
    return result;
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('comments.view')
  async getComments(@Query() query: any) {
    return this.commentsService.getComments(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('comments.view')
  async getComment(@Param('id') id: string) {
    return this.commentsService.getCommentById(id);
  }

  @Post()
  async createComment(@Body() body: any) {
    // Публичный endpoint - не требует авторизации
    return this.commentsService.createComment(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('comments.edit')
  async updateComment(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    // Автоматически устанавливаем moderatorId при одобрении комментария
    const moderatorId = req.user?.id;
    return this.commentsService.updateComment(id, body, moderatorId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('comments.delete')
  async deleteComment(@Param('id') id: string) {
    return this.commentsService.deleteComment(id);
  }
}

