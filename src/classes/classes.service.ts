import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { ClassesStatus } from '@prisma/client';
import { NotificationService } from 'src/common/notification/notification.service';

@Injectable()
export class ClassesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService
  ) { }

  async create(createClassDto: CreateClassDto) {
    const cl = await this.prismaService.classes.create({
      data: createClassDto,
    });
    await this.notificationService.newClass(createClassDto.trainee_id, createClassDto.personal_id, cl.id);
    return cl;
  }

  async getPersonalClasses(token: string) {
    const classes = await this.prismaService.classes.findMany({
      where: {
        personal_id: token,
        status: 'pending',
      },
    });

    if (!classes) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }

    const response = await Promise.all(
      classes.map(async (cl) => {
        const trainee = await this.prismaService.trainee.findUnique({
          where: {
            id: cl.trainee_id,
          },
        });

        return {
          class_id: cl.id,
          id: trainee.id,
          full_name: trainee.full_name,
          avatar: trainee.avatar,
        };
      }),
    );

    return response;
  }

  async getTraineeClasses(token: string) {
    const classes = await this.prismaService.classes.findMany({
      where: {
        trainee_id: token,
        status: 'pending',
      },
    });

    if (!classes) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }

    const response = await Promise.all(
      classes.map(async (cl) => {
        const personal = await this.prismaService.page.findUnique({
          where: {
            personal_id: cl.personal_id,
          },
        });

        return {
          class_id: cl.id,
          id: personal.personal_id,
          page_name: personal.page_name,
          url: personal.url,
          avatar: personal.avatar,
        };
      }),
    );

    return response;
  }

  async delete(class_id: string, requested_by: string) {
    const cl = await this.prismaService.classes.delete({
      where: {
        id: class_id,
      },
    });

    if (!cl) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }

    // Cancel notification
    await this.notificationService.cancelClass({
      trainee_id: cl.trainee_id,
      personal_id: cl.personal_id,
      class_id: cl.id,
      type: requested_by,
    });

    return cl;
  }

  async update(class_id: string, newStatus: ClassesStatus, elapsed_time = 0) {
    console.log('Updating class status:', class_id, newStatus, elapsed_time);
    const classToUpdate = await this.prismaService.classes.findUnique({
      where: { id: class_id },
    });

    const updatedClass = await this.prismaService.classes.update({
      where: { id: class_id },
      data: { status: newStatus, elapsed_time: classToUpdate.elapsed_time + elapsed_time },
    });

    // If newStatus is rejected the only way is the trainee reject the class, so lets already do the notification for personal
    if (newStatus === 'rejected') {
      await this.notificationService.cancelClass({
        trainee_id: updatedClass.trainee_id,
        personal_id: updatedClass.personal_id,
        class_id: updatedClass.id,
        type: 'trainee',
      });
    }

    if (newStatus === 'finished') {
      console.log('Creating rating for trainee');
      const rating = await this.prismaService.ratings.create({
        data: {
          trainee_id: updatedClass.trainee_id,
          personal_id: updatedClass.personal_id,
          request: 'ongoing',
        }
      });
      await this.notificationService.newRating(updatedClass.trainee_id, updatedClass.personal_id, rating.id);
    }

    return updatedClass;
  }
  catch(error: any) {
    // Handle specific Prisma errors if needed
    if (error.code === 'P2025') {
      // Record to update not found.
      return {
        status: 404,
        message: 'Class not found.',
      };
    }

    console.error('Error updating class status:', error);
    return {
      status: 500,
      message: 'Internal Server Error',
    };
  }

  async getTraineeResponses(id: string, status: string) {
    const classes = await this.prismaService.classes.findMany({
      where: {
        personal_id: id,
      },
    });

    if (!classes) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }

    const filter = classes.filter((cl) => cl.status === status);

    const response = await Promise.all(
      filter.map(async (cl) => {
        const trainee = await this.prismaService.trainee.findUnique({
          where: {
            id: cl.trainee_id,
          },
        });

        return {
          class_id: cl.id,
          id: trainee.id,
          full_name: trainee.full_name,
          avatar: trainee.avatar,
        };
      }),
    );

    return response;
  }
}
