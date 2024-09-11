import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { RedisService } from 'src/redis.service';

@Injectable()
export class VisitorsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) { }

  async trackVisitor(visitorId: string, page_id: string, type: string): Promise<boolean> {
    const redisClient = this.redisService.getClient(); // Get Redis client

    const visitorKey = `visitor:${visitorId}.${page_id}-${type}`;
    const lastVisit = await redisClient.get(visitorKey);

    if (lastVisit) {
      const timeElapsed = Date.now() - Number(lastVisit);
      const tenMinutes = 10 * 60 * 1000;
      if (timeElapsed < tenMinutes) {
        return false;
      }
    }

    await redisClient.set(visitorKey, Date.now(), 'EX', 60 * 60); // Expire in 10 minutes
    return true;
  }


  create(createVisitorDto: CreateVisitorDto) {

    const visitor = this.prismaService.visitors.create({
      data: {
        ...createVisitorDto,
      }
    });
    if (!visitor) {
      throw new Error('Visitor not created');
    }
    return visitor;
  }


}
