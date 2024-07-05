import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PagesModule } from './pages/pages.module';
import { BullModule } from '@nestjs/bull';
import { BullBoardService } from './bull-board.service';

@Module({
  imports: [
    UsersModule,
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
  ],
  controllers: [AppController],
  providers: [AppService, BullBoardService],
})
export class AppModule {
  constructor(private readonly bullBoardService: BullBoardService) { }

  configure(consumer: MiddlewareConsumer) {
    const adminRouter = this.bullBoardService.onModuleInit();
    consumer.apply(adminRouter).forRoutes('/admin/queues');
  }
}
