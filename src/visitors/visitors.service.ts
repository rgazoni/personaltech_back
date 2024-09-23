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


  async create(createVisitorDto: CreateVisitorDto) {
    const currentDate = new Date();
    const dateOnly = new Date(currentDate.toISOString().split('T')[0]);

    const page = await this.prismaService.page.findUnique({
      where: {
        id: createVisitorDto.page_id,
      }
    });

    if (createVisitorDto.visitor_id === page.personal_id) {
      return;
    }

    const visitor = this.prismaService.visitors.create({
      data: {
        ...createVisitorDto,
        createdAt: dateOnly,
      }
    });
    if (!visitor) {
      throw new Error('Visitor not created');
    }
    return visitor;
  }

  async getWeeklyReport(trainerId: string) {
    const weeklyReport = await this.prismaService.visitors.groupBy({
      by: ['createdAt'],
      where: {
        page_id: trainerId,
        type: 'visit',
      },
      _count: {
        visitor_id: true,
      },
      orderBy: {
        createdAt: 'asc',
      }
    });

    if (!weeklyReport || weeklyReport.length === 0) {
      throw new Error('No visitors found for the trainer');
    }

    return weeklyReport.map(report => ({
      date: report.createdAt,
      views: report._count.visitor_id,
    }));
  }

  async getGenderReport(trainerId: string) {
    const users = await this.prismaService.visitors.findMany({
      where: {
        page_id: trainerId,
        type: 'visit',
        visitor_type: 'trainee',
      },
      select: {
        visitor_id: true,
      }
    });

    if (!users || users.length === 0) {
      throw new Error('No visitors found for the trainer');
    }

    const userIds = users.map(user => user.visitor_id);

    const genderReport = await this.prismaService.trainee.findMany({
      where: {
        id: {
          in: userIds,
        }
      },
      select: {
        gender: true,
      }
    });

    if (!genderReport || genderReport.length === 0) {
      throw new Error('No trainees found for the trainer');
    }

    const genderGroups = [
      { gender: "Masculino", abrv: 'M', visitors: 0, fill: "#0E6B2E" },
      { gender: "Feminino", abrv: 'F', visitors: 0, fill: "#113B1D" },
      { gender: "Não binário", abrv: 'NB', visitors: 0, fill: "#0B8636" },
    ];

    genderReport.forEach(report => {
      genderGroups.find(group => group.abrv === report.gender).visitors++;
    });

    return genderGroups;
  }

  async getAgeReport(trainerId: string) {

    const users = await this.prismaService.visitors.findMany({
      where: {
        page_id: trainerId,
        type: 'visit',
        visitor_type: 'trainee',
      },
      select: {
        visitor_id: true,
      }
    });

    if (!users || users.length === 0) {
      throw new Error('No visitors found for the trainer');
    }

    const userIds = users.map(user => user.visitor_id);

    const ageReport = await this.prismaService.trainee.findMany({
      where: {
        id: {
          in: userIds,
        }
      },
      select: {
        birthdate: true,
      }
    });

    if (!ageReport || ageReport.length === 0) {
      throw new Error('No trainees found for the trainer');
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const ageGroups = {
      '0-18': 0,
      '19-30': 0,
      '31-45': 0,
      '46-60': 0,
      '61+': 0,
    };

    ageReport.forEach(report => {
      const birthYear = report.birthdate.getFullYear();
      const age = currentYear - birthYear;
      if (age <= 18) {
        ageGroups['0-18']++;
      } else if (age <= 30) {
        ageGroups['19-30']++;
      } else if (age <= 45) {
        ageGroups['31-45']++;
      } else if (age <= 60) {
        ageGroups['46-60']++;
      } else {
        ageGroups['61+']++;
      }
    });

    return ageGroups;
  }

  async getRegionsReport(trainerId: string) {
    const users = await this.prismaService.visitors.findMany({
      where: {
        page_id: trainerId,
        type: 'visit',
        visitor_type: 'trainee',
      },
      select: {
        visitor_id: true,
      }
    });

    if (!users || users.length === 0) {
      throw new Error('No visitors found for the trainer');
    }

    const userIds = users.map(user => user.visitor_id);

    const regionsReport = await this.prismaService.trainee.findMany({
      where: {
        id: {
          in: userIds,
        }
      },
      select: {
        city: true,
        state: true,
      }
    });

    if (!regionsReport || regionsReport.length === 0) {
      throw new Error('No trainees found for the trainer');
    }

    const regions = [];
    regionsReport.forEach(report => {
      const regionIndex = regions.findIndex(region => region.city === report.city && region.state === report.state);
      if (regionIndex !== -1) {
        regions[regionIndex].count++;
      } else {
        regions.push({
          city: report.city,
          state: report.state,
          count: 1,
        });
      }
    });
    return regions;
  }

  async getHoursReport(trainerId: string) {
    const minutes = await this.prismaService.classes.findMany({
      where: {
        personal_id: trainerId,
        status: 'finished',
      },
    });
    if (!minutes) {
      throw new Error('No classes found for the trainer');
    }
    const sum = minutes.reduce((acc, curr) => acc + curr.elapsed_time, 0);
    return { elapsed_time: sum };
  }
}
