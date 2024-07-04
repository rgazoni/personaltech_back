import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { CrefModule } from './cref/cref.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  imports: [CrefModule]
})
export class UsersModule { }
