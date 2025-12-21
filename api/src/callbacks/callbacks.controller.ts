import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CallbacksService } from './callbacks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@Controller('callbacks')
export class CallbacksController {
  constructor(private callbacksService: CallbacksService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('callbacks.view')
  async getCallbacks(@Query() query: any) {
    return this.callbacksService.getCallbacks(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('callbacks.view')
  async getCallback(@Param('id') id: string) {
    return this.callbacksService.getCallbackById(id);
  }

  @Post()
  async createCallback(@Body() body: any) {
    return this.callbacksService.createCallback(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('callbacks.edit')
  async updateCallback(@Param('id') id: string, @Body() body: any) {
    return this.callbacksService.updateCallback(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('callbacks.delete')
  async deleteCallback(@Param('id') id: string) {
    return this.callbacksService.deleteCallback(id);
  }
}


