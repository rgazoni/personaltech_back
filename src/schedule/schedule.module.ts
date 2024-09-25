import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { PrismaService } from 'src/prisma.service';
import { NotificationModule } from 'src/common/notification/notification.module';

@Module({
  imports: [NotificationModule],
  providers: [ScheduleService, PrismaService],
  controllers: [ScheduleController]
})
export class ScheduleModule { }
