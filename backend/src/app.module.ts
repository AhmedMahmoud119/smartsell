import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { StoreModule } from './modules/store/store.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    // Environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    }]),

    // Database
    PrismaModule,

    // Feature modules
    AuthModule,
    UserModule,
    StoreModule,
    ProductModule,
    OrderModule,
  ],
})
export class AppModule {}
