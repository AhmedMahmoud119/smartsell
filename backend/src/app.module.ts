import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { StoreModule } from './modules/store/store.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { CustomerModule } from './modules/customer/customer.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { PixelsModule } from './modules/pixels/pixels.module';
import { UploadModule } from './modules/upload/upload.module';

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

    // Serve uploaded files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // Database
    PrismaModule,

    // Feature modules
    AuthModule,
    UserModule,
    StoreModule,
    ProductModule,
    OrderModule,
    CustomerModule,
    AnalyticsModule,
    PixelsModule,
    UploadModule,
  ],
})
export class AppModule {}

