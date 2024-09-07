import { Module } from '@nestjs/common';
import { TraineeService } from './trainee.service';
import { TraineeController } from './trainee.controller';
import { PrismaService } from 'src/prisma.service';
import { CometChatModule } from 'src/common/comet-chat/comet-chat.module';

@Module({
  imports: [CometChatModule],
  providers: [TraineeService, PrismaService],
  controllers: [TraineeController]
})
export class TraineeModule { }
