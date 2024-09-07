import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CometChatService } from './comet-chat.service';

@Module({
  imports: [HttpModule], // Import HttpModule to use HttpService
  providers: [CometChatService], // Provide the service
  exports: [CometChatService], // Export the service
})
export class CometChatModule { }
