import { Module } from '@nestjs/common';
import { CallbacksController } from './callbacks.controller';
import { CallbacksService } from './callbacks.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CallbacksController],
  providers: [CallbacksService],
  exports: [CallbacksService],
})
export class CallbacksModule {}

