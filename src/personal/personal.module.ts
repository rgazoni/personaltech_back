import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CrefModule } from './cref/cref.module';
import { PersonalController } from './personal.controller';
import { PersonalService } from './personal.service';

@Module({
  imports: [CrefModule],
  controllers: [PersonalController],
  providers: [PersonalService, PrismaService],
})
export class PersonalModule { }
