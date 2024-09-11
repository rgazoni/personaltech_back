import { Module } from '@nestjs/common';
import { VisitorsController } from './visitors.controller';
import { VisitorsService } from './visitors.service';
import { PrismaService } from 'src/prisma.service';
import { RedisService } from 'src/redis.service';

@Module({
  controllers: [VisitorsController],
  providers: [VisitorsService, PrismaService, RedisService]
})
export class VisitorsModule { }
