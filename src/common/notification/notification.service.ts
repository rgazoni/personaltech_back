import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue('notification') private notificationQueue: Queue,
    private readonly prismaService: PrismaService,
  ) { }

  //
  // Trainee notifications
  // ---------------------
  // section: trainee
  //
  async newRating(
    trainee_id: string,
    professional_id: string,
    rating_id: string,
  ) {
    await this.notificationQueue.add('new_rating', {
      trainee_id: trainee_id,
      professional_id: professional_id,
      rating_id: rating_id,
    });
  }

  async newClass(trainee_id: string, personal_id: string, class_id: string) {
    await this.notificationQueue.add('new_class', {
      trainee_id: trainee_id,
      personal_id: personal_id,
      class_id: class_id,
    });
  }

  async cancelRating({
    trainee_id,
    personal_id,
    rating_id,
    type,
  }: {
    trainee_id: string;
    personal_id: string;
    rating_id: string;
    type: string;
  }) {
    await this.notificationQueue.add('cancel_rating', {
      trainee_id: trainee_id,
      personal_id: personal_id,
      rating_id: rating_id,
      type: type,
    });
  }

  async cancelClass({
    trainee_id,
    personal_id,
    class_id,
    type,
  }: {
    trainee_id: string;
    personal_id: string;
    class_id: string;
    type: string;
  }) {
    await this.notificationQueue.add('cancel_class', {
      trainee_id: trainee_id,
      personal_id: personal_id,
      class_id: class_id,
      type: type,
    });
  }

  async cancelScheduling({
    trainee_id,
    personal_id,
    schedule_id,
    type,
  }: {
    trainee_id: string;
    personal_id: string;
    schedule_id: string;
    type: string;
  }) {
    await this.notificationQueue.add('cancel_schedule', {
      trainee_id: trainee_id,
      personal_id: personal_id,
      schedule_id: schedule_id,
      type: type,
    });
  }


  //
  // Professional notifications
  // --------------------------
  // section: professional
  //

  async newScheduling({
    personal_id,
    endTime,
    startTime,
    trainee_id,
    schedule_id,
  }: {
    trainee_id: string;
    personal_id: string;
    schedule_id: string;
    startTime: string;
    endTime: string;
  }) {
    await this.notificationQueue.add('new_schedule', {
      trainee_id: trainee_id,
      personal_id: personal_id,
      schedule_id: schedule_id,
      startTime: startTime,
      endTime: endTime,
    });
  }

  async traineeCommented({
    trainee_id,
    personal_id,
    rating_id,
  }: {
    trainee_id: string;
    personal_id: string;
    rating_id: string;
  }) {
    await this.notificationQueue.add('trainee_commented', {
      trainee_id: trainee_id,
      personal_id: personal_id,
      rating_id: rating_id,
    });
  }

  //
  // Handle requests functions
  // -------------------------
  // section: requests
  //

  async getNotifications(personal_id: string) {
    const notifications = await this.prismaService.notification.findMany({
      where: {
        person_id: personal_id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!notifications) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }

    console.log(notifications);

    return notifications;
  }

  markAsRead(notification_ids: string[]) {
    return this.prismaService.notification.updateMany({
      where: {
        id: {
          in: notification_ids,
        },
      },
      data: {
        read: true,
      },
    });
  }
}
