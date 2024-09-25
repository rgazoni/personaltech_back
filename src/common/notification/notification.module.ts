import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { NotificationProcessor } from './notification.processor';
import { NotificationService } from './notification.service';
import { PrismaService } from 'src/prisma.service';
import { ScheduleModule } from '@nestjs/schedule';
import { WeeklyReportService } from './weekly-report.service';
import { NotificationController } from './notification.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notification',
    }),
    ScheduleModule.forRoot()
  ],
  controllers: [NotificationController],
  providers: [NotificationProcessor, NotificationService, PrismaService, WeeklyReportService], 
  exports: [NotificationService],
})
export class NotificationModule { }
