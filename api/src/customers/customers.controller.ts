import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomerAuthService, CustomerRegisterDto, CustomerLoginDto } from './customer-auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CustomerAuthGuard } from './guards/customer-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@Controller('customers')
export class CustomersController {
  constructor(
    private customersService: CustomersService,
    private customerAuthService: CustomerAuthService,
  ) {}

  // Публичные endpoints для клиентов
  @Post('auth/register')
  async register(@Body() body: CustomerRegisterDto) {
    const result = await this.customerAuthService.register(body);
    return {
      success: true,
      data: result,
    };
  }

  @Post('auth/login')
  async login(@Body() body: CustomerLoginDto) {
    const result = await this.customerAuthService.login(body);
    return {
      success: true,
      data: result,
    };
  }

  @Post('auth/refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    const result = await this.customerAuthService.refreshToken(body.refreshToken);
    return {
      success: true,
      data: result,
    };
  }

  @Get('auth/me')
  @UseGuards(CustomerAuthGuard)
  async getMe(@Request() req) {
    const customer = await this.customerAuthService.getCustomerById(req.customer.id);
    return {
      success: true,
      data: customer,
    };
  }

  @Get('auth/orders')
  @UseGuards(CustomerAuthGuard)
  async getMyOrders(@Request() req, @Query() query: any) {
    const { page = 1, limit = 10 } = query;
    const orders = await this.customersService.getCustomerOrders(req.customer.id, { page, limit });
    return {
      success: true,
      data: orders,
    };
  }

  @Put('auth/profile')
  @UseGuards(CustomerAuthGuard)
  async updateProfile(@Request() req, @Body() body: any) {
    const { password, ...updateData } = body;
    const customer = await this.customersService.updateCustomer(req.customer.id, updateData);
    return {
      success: true,
      data: customer,
    };
  }

  // Админские endpoints
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('customers.view')
  async getCustomers(@Query() query: any) {
    return this.customersService.getCustomers(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('customers.view')
  async getCustomer(@Param('id') id: string) {
    return this.customersService.getCustomerById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('customers.edit')
  async createCustomer(@Body() body: any) {
    return this.customersService.createCustomer(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('customers.edit')
  async updateCustomer(@Param('id') id: string, @Body() body: any) {
    return this.customersService.updateCustomer(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('customers.delete')
  async deleteCustomer(@Param('id') id: string) {
    return this.customersService.deleteCustomer(id);
  }
}
