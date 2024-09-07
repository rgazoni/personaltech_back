import { Module } from '@nestjs/common';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { PrismaService } from 'src/prisma.service';
import { CometChatModule } from 'src/common/comet-chat/comet-chat.module';

@Module({
  imports: [CometChatModule],
  controllers: [PagesController],
  providers: [PagesService, PrismaService],
})
export class PagesModule { }
