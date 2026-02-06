import { Module } from '@nestjs/common';
import { PixelsController } from './pixels.controller';
import { PixelsService } from './pixels.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PixelsController],
  providers: [PixelsService],
  exports: [PixelsService],
})
export class PixelsModule {}
