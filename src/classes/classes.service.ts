import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { ClassesStatus } from '@prisma/client';

@Injectable()
export class ClassesService {
  constructor(private readonly prismaService: PrismaService) { }

  create(createClassDto: CreateClassDto) {
    return this.prismaService.classes.create({
      data: createClassDto,
    });
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

  async delete(class_id: string) {
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

    return cl;
  }

  async update(class_id: string, newStatus: ClassesStatus, elapsed_time: number) {
    const classToUpdate = await this.prismaService.classes.findUnique({
      where: { id: class_id },
    });

    const updatedClass = await this.prismaService.classes.update({
      where: { id: class_id },
      data: { status: newStatus, elapsed_time: classToUpdate.elapsed_time + elapsed_time },
    });

    if (newStatus === 'finished') {
      await this.prismaService.ratings.create({
        data: {
          trainee_id: updatedClass.trainee_id,
          personal_id: updatedClass.personal_id,
          request: 'ongoing',
        }
      });
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
