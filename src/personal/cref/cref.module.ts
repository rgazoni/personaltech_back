import { Module } from '@nestjs/common';
import { CrefService } from './cref.service';
import { CrefProcessor } from './processors/cref-validate.processor';
import { BullModule } from '@nestjs/bull';
import { PrismaService } from 'src/prisma.service';
import { CrefController } from './cref.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'cref',
    }),
  ],
  controllers: [CrefController],
  providers: [CrefService, CrefProcessor, PrismaService],
  exports: [CrefService],
})
export class CrefModule { }
