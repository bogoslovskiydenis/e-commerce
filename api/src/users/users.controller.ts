import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@Controller('admin/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('users.view')
  async getUsers(@Query() query: any) {
    return this.usersService.getUsers(query);
  }

  @Get('system/roles-and-permissions')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('users.view')
  async getRolesAndPermissions() {
    return this.usersService.getRolesAndPermissions();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('users.view')
  async getUser(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('users.create')
  async createUser(@Body() body: any) {
    return this.usersService.createUser(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('users.edit')
  async updateUser(@Param('id') id: string, @Body() body: any) {
    return this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('users.delete')
  async deleteUser(@Param('id') id: string, @Request() req: any) {
    return this.usersService.deleteUser(id, req.user.id);
  }

  @Post(':id/change-password')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('users.edit')
  async changePassword(@Param('id') id: string, @Body() body: { newPassword: string }) {
    return this.usersService.changePassword(id, body.newPassword);
  }

  @Post(':id/toggle-status')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('users.edit')
  async toggleActiveStatus(@Param('id') id: string, @Request() req: any) {
    return this.usersService.toggleActiveStatus(id, req.user.id);
  }
}
