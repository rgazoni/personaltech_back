import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { NewRatingEvent } from './events/new-rating.event';
import { PrismaService } from 'src/prisma.service';
import { NewClassEvent } from './events/new-class.event';
import { CancelRatingEvent } from './events/cancel-rating';
import { CancelClassEvent } from './events/cancel-class';
import { CancelScheduleEvent } from './events/cancel-schedule';
import { NewScheduleEvent } from './events/new-schedule.event';
import { TraineeCommentedEvent } from './events/trainee-commented.event';

@Processor('notification')
export class NotificationProcessor {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

  @Process('new_rating')
  async newRating(job: Job<NewRatingEvent>) {
    const { trainee_id, professional_id, rating_id } = job.data;

    const professional = await this.prismaService.page.findUnique({
      where: {
        personal_id: professional_id
      }
    });

    if (!professional) {
      console.error('Professional not found');
      return;
    }

    const notification = await this.prismaService.notification.create({
      data: {
        type: 'new_rating',
        message: `Avalie sua aula com ${professional.page_name}`,
        person_id: trainee_id,
        person_type: 'trainee',
        reference_id: rating_id
      }
    });

    console.log('Notification created:', notification);
  }

  @Process('cancel_rating')
  async cancelRating(job: Job<CancelRatingEvent>) {
    const { rating_id, personal_id, trainee_id, type } = job.data;

    const event = await this.prismaService.notification.findFirst({
      where: {
        reference_id: rating_id
      }
    });

    if (!event.read) {
      await this.prismaService.notification.delete({
        where: {
          id: event.id
        }
      });
      return;
    }

    let message: string;
    let person_type: string;
    if (type === 'personal') {
      //Event was read
      const professional = await this.prismaService.page.findUnique({
        where: {
          personal_id
        }
      });

      if (!professional) {
        console.error('Professional not found');
        return;
      }
      message = `${professional.page_name} cancelou a aula`
      person_type = 'trainee';
    } else if (type === 'trainee') {
      const trainee = await this.prismaService.trainee.findUnique({
        where: {
          id: trainee_id
        }
      });

      if (!trainee) {
        console.error('Trainee not found');
        return;
      }

      message = `${trainee.full_name} cancelou a aula`;
      person_type = 'personal';
    }

    const notification = await this.prismaService.notification.create({
      data: {
        type: 'cancel_rating',
        message: message,
        person_id: trainee_id,
        person_type: person_type,
        reference_id: rating_id
      }
    });

    console.log('Notification created:', notification);
  }

  @Process('new_class')
  async newClass(job: Job<NewClassEvent>) {
    const { trainee_id, personal_id, class_id } = job.data;

    const personal = await this.prismaService.page.findUnique({
      where: {
        personal_id
      }
    });

    if (!personal) {
      console.error('Personal not found');
      return;
    }

    const notification = await this.prismaService.notification.create({
      data: {
        type: 'new_class',
        message: `${personal.page_name} quer iniciar uma aula com você`,
        person_id: trainee_id,
        person_type: 'trainee',
        reference_id: class_id
      }
    });

    console.log('Notification created:', notification);
  }


  @Process('cancel_class')
  async cancelClass(job: Job<CancelClassEvent>) {
    console.log('Cancel class job:', job.data);
    const { class_id, personal_id, trainee_id, type } = job.data;

    const event = await this.prismaService.notification.findFirst({
      where: {
        reference_id: class_id
      }
    });

    // type !== event.person_type -> if the event was read by the same person that is canceling the class, 
    // we don't need to create a new notification
    if (!event.read && type !== event.person_type) {
      await this.prismaService.notification.delete({
        where: {
          id: event.id
        }
      });
      return;
    }

    let message: string;
    let person_type: string;
    if (type === 'personal') {
      //Event was read
      const professional = await this.prismaService.page.findUnique({
        where: {
          personal_id
        }
      });

      if (!professional) {
        console.error('Professional not found');
        return;
      }
      message = `${professional.page_name} cancelou a requisição de aula`
      person_type = 'trainee';
    } else if (type === 'trainee') {
      const trainee = await this.prismaService.trainee.findUnique({
        where: {
          id: trainee_id
        }
      });

      if (!trainee) {
        console.error('Trainee not found');
        return;
      }

      message = `${trainee.full_name} optou por cancelar a requisição de aula`;
      person_type = 'personal';
    }

    const notification = await this.prismaService.notification.create({
      data: {
        type: 'cancel_class',
        message: message,
        person_id: trainee_id,
        person_type: person_type,
        reference_id: class_id
      }
    });

    console.log('Notification created:', notification);
  }

  @Process('new_schedule')
  async newSchedule(job: Job<NewScheduleEvent>) {
    const { personal_id, endTime, startTime, trainee_id, schedule_id } = job.data;

    const trainee = await this.prismaService.trainee.findUnique({
      where: {
        id: trainee_id
      }
    });

    if (!trainee) {
      console.error('Trainee not found');
      return;
    }

    const notification = await this.prismaService.notification.create({
      data: {
        type: 'new_schedule',
        message: `${trainee.full_name} agendou uma aula com você às ${startTime} até ${endTime}`,
        person_id: personal_id,
        person_type: 'personal',
        reference_id: schedule_id
      }
    });

    console.log('Notification created:', notification);
  }


  @Process('cancel_schedule')
  async cancelSchedule(job: Job<CancelScheduleEvent>) {
    const { schedule_id, personal_id, trainee_id, type } = job.data;

    const event = await this.prismaService.notification.findFirst({
      where: {
        reference_id: schedule_id
      }
    });

    // type !== event.person_type -> if the event was read by the same person that is canceling the class, 
    // we don't need to create a new notification
    if (!event.read && type !== event.person_type) {
      await this.prismaService.notification.delete({
        where: {
          id: event.id
        }
      });
      return;
    }

    let message: string;
    let person_type: string;
    if (type === 'personal') {
      //Event was read
      const professional = await this.prismaService.page.findUnique({
        where: {
          personal_id
        }
      });

      if (!professional) {
        console.error('Professional not found');
        return;
      }
      message = `${professional.page_name} cancelou a aula`
      person_type = 'trainee';
    } else if (type === 'trainee') {
      const trainee = await this.prismaService.trainee.findUnique({
        where: {
          id: trainee_id
        }
      });

      if (!trainee) {
        console.error('Trainee not found');
        return;
      }

      message = `${trainee.full_name} optou por cancelar a aula`;
      person_type = 'personal';
    }

    const notification = await this.prismaService.notification.create({
      data: {
        type: 'cancel_schedule',
        message: message,
        person_id: trainee_id,
        person_type: person_type,
        reference_id: schedule_id
      }
    });

    console.log('Notification created:', notification);
  }

  @Process('trainee_commented')
  async traineeCommented(job: Job<TraineeCommentedEvent>) {
    const { trainee_id, personal_id, rating_id } = job.data;

    const trainee = await this.prismaService.trainee.findUnique({
      where: {
        id: trainee_id
      }
    });

    if (!trainee) {
      console.error('Trainee not found');
      return;
    }

    const notification = await this.prismaService.notification.create({
      data: {
        type: 'trainee_commented',
        message: `${trainee.full_name} comentou sobre sua aula`,
        person_id: personal_id,
        person_type: 'personal',
        reference_id: rating_id
      }
    });

    console.log('Trainee commented:', notification);
  }
}

