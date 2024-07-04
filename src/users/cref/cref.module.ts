import { Module } from '@nestjs/common';
import { CrefController } from './cref.controller';
import { CrefService } from './cref.service';

@Module({
  controllers: [CrefController],
  providers: [CrefService]
})
export class CrefModule {}
