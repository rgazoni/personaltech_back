import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PagesModule } from './pages/pages.module';
import { BullModule } from '@nestjs/bull';
import { BullBoardService } from './bull-board.service';
import { PersonalModule } from './personal/personal.module';
import { RatingsModule } from './ratings/ratings.module';
import { CometChatModule } from './common/comet-chat/comet-chat.module';
import { TraineeModule } from './trainee/trainee.module';
import { AuthModule } from './auth/auth.module';
import { RedisService } from './redis.service';
import { VisitorsModule } from './visitors/visitors.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ClassesModule } from './classes/classes.module';
import { NotificationModule } from './common/notification/notification.module';

@Module({
  imports: [
    PersonalModule,
    PagesModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'cref',
    }),
    RatingsModule,
    CometChatModule,
    TraineeModule,
    AuthModule,
    VisitorsModule,
    ScheduleModule,
    ClassesModule,
    NotificationModule,
  ],
  controllers: [AppController], 
  providers: [AppService, BullBoardService, RedisService],
  exports: [RedisService],
})
export class AppModule {
  constructor(private readonly bullBoardService: BullBoardService) { }

  configure(consumer: MiddlewareConsumer) {
    const adminRouter = this.bullBoardService.onModuleInit();
    consumer.apply(adminRouter).forRoutes('/admin/queues');
  }
}
