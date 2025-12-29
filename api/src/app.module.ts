import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { NavigationModule } from './navigation/navigation.module';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { BannersModule } from './banners/banners.module';
import { PagesModule } from './pages/pages.module';
import { SettingsModule } from './settings/settings.module';
import { AdminLogsModule } from './admin-logs/admin-logs.module';
import { CallbacksModule } from './callbacks/callbacks.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PromotionsModule } from './promotions/promotions.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: 900000, // 15 минут
          limit: config.get('NODE_ENV') === 'production' ? 100 : 1000,
        },
      ],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    NavigationModule,
    OrdersModule,
    CustomersModule,
    BannersModule,
    PagesModule,
    SettingsModule,
    AdminLogsModule,
    CallbacksModule,
    ReviewsModule,
    FavoritesModule,
    PromotionsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

