import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CustomerAuthService } from './customer-auth.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
    ConfigModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService, CustomerAuthService],
  exports: [CustomersService, CustomerAuthService],
})
export class CustomersModule {}


