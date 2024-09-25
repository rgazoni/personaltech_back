import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class WeeklyReportService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  @Cron(CronExpression.EVERY_WEEK)
  async handleWeeklyReport() {

    const personal = await this.prismaService.personal.findMany();

    const notificationsData = personal.map((personal) => {
      return {
        type: 'weekly_report',
        message: 'Seu relatório semanal está disponível',
        person_id: personal.id,
        person_type: 'personal',
        reference_id: '',
      }
    })

    // Use createMany to insert multiple records at once
    const result = await this.prismaService.notification.createMany({
      data: notificationsData,
      skipDuplicates: true, // Optional: skips records that violate unique constraints
    });

    console.log(`Created ${result.count} notifications`);
    console.log('Task running every hour');

  }
}
