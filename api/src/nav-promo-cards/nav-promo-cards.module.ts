import { Module } from '@nestjs/common';
import { NavPromoCardsController } from './nav-promo-cards.controller';
import { NavPromoCardsService } from './nav-promo-cards.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NavPromoCardsController],
  providers: [NavPromoCardsService],
  exports: [NavPromoCardsService],
})
export class NavPromoCardsModule {}
