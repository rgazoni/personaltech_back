import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { CrefModule } from './cref/cref.module';

@Module({
  imports: [CrefModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule { }
