import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { PrismaService } from 'src/prisma.service';
import { NotificationModule } from 'src/common/notification/notification.module';

@Module({
  imports: [NotificationModule],
  providers: [RatingsService, PrismaService],
  controllers: [RatingsController]
})
export class RatingsModule { }
