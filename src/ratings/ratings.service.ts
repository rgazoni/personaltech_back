import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RequestStatus } from '@prisma/client';
import { UpdateRequestDto } from './dto/update-request.dto';
import { NotificationService } from 'src/common/notification/notification.service';

@Injectable()
export class RatingsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService
  ) { }
  //Creates a new rating
  async create(createRatingDto: CreateRatingDto) {

    const rating = await this.prismaService.ratings.create({
      data: {
        trainee_id: createRatingDto.trainee_id,
        personal_id: createRatingDto.personal_id,
      }
    });

    //Add a new notification to the queue for the trainee to be notified of the new rating proposal
    await this.notificationService.newRating(createRatingDto.trainee_id, createRatingDto.personal_id, rating.id);

    if (!rating) {
      return {
        status: 500,
        message: 'Internal Server Error'
      }
    }
    return {
      status: 200,
      message: 'Rating created successfully'
    }
  }

  async getPersonalPending(token: string) {
    const ratings = await this.prismaService.ratings.findMany({
      where: {
        personal_id: token,
        request: 'pending'
      }
    });

    if (!ratings) {
      return {
        status: 500,
        message: 'Internal Server Error'
      }
    }

    const response = await Promise.all(ratings.map(async (rating) => {
      const trainee = await this.prismaService.trainee.findUnique({
        where: {
          id: rating.trainee_id
        }
      });

      return {
        id: trainee.id,
        full_name: trainee.full_name,
        avatar: trainee.avatar
      }
    }))

    return response
  }

  async getPersonalRatings(token: string) {
    const ratings = await this.prismaService.ratings.findMany({
      where: {
        personal_id: token,
        request: 'ongoing'
      }
    });

    if (!ratings) {
      return {
        status: 500,
        message: 'Internal Server Error'
      }
    }

    const response = await Promise.all(ratings.map(async (rating) => {
      const trainee = await this.prismaService.trainee.findUnique({
        where: {
          id: rating.trainee_id
        }
      });

      return {
        rating_id: rating.id,
        trainee_id: trainee.id,
        full_name: trainee.full_name,
        avatar: trainee.avatar
      }
    }))

    return response
  }

  async getTraineeRatings(token: string) {
    const ratings = await this.prismaService.ratings.findMany({
      where: {
        trainee_id: token,
        request: 'ongoing'
      }
    });

    if (!ratings) {
      return {
        status: 500,
        message: 'Internal Server Error'
      }
    }

    const response = await Promise.all(ratings.map(async (rating) => {
      const personal = await this.prismaService.page.findUnique({
        where: {
          personal_id: rating.personal_id
        }
      });

      return {
        rating_id: rating.id,
        personal_id: personal.personal_id,
        page_name: personal.page_name,
        url: personal.url,
        avatar: personal.avatar
      }
    }))

    return response
  }

  async delete(id: string, requested_by: string) {
    const rating = await this.prismaService.ratings.delete({
      where: {
        id: id
      }
    });

    if (!rating) {
      return {
        status: 500,
        message: 'Internal Server Error'
      }
    }

    //Add a new notification to the queue for the trainee to be notified of the rating cancellation
    await this.notificationService.cancelRating({
      trainee_id: rating.trainee_id,
      personal_id: rating.personal_id,
      type: requested_by,
      rating_id: rating.id
    });

    return rating
  }

  async update(updateRatingDto: UpdateRatingDto) {
    const rating = await this.prismaService.ratings.update({
      where: {
        id: updateRatingDto.id
      },
      data: {
        rating: updateRatingDto.rating,
        comment: updateRatingDto.comment,
        request: updateRatingDto.request,
        userResponseAt: updateRatingDto.userResponseAt
      }
    });

    if (!rating) {
      return {
        status: 500,
        message: 'Internal Server Error'
      }
    }

    return rating
  }

  async info(status: RequestStatus, token: string) {
    const ratings = await this.prismaService.ratings.findMany({
      where: {
        request: status,
        personal_id: token
      }
    });

    console.log(ratings)

    if (!ratings) {
      return {
        status: 500,
        message: 'Internal Server Error'
      }
    }

    const trainees = await this.prismaService.trainee.findMany({
      where: {
        id: {
          in: ratings.map(rating => rating.trainee_id)
        }
      }
    });

    if (!trainees) {
      return {
        status: 500,
        message: 'Internal Server Error'
      }
    }

    const sortType = await this.prismaService.page.findUnique({
      where: {
        personal_id: token
      }
    });


    const response = ratings.map((rating) => {
      const trainee = trainees.find(trainee => trainee.id === rating.trainee_id);
      return {
        id: rating.id,
        trainee_id: trainee.id,
        full_name: trainee.full_name,
        avatar: trainee.avatar,
        rating: rating.rating,
        comment: rating.comment,
        request: rating.request,
        userResponseAt: new Date(rating.userResponseAt)
      }
    })

    if (sortType.comments_sort === 'rate_desc') {
      response.sort((a, b) => b.rating - a.rating);
    }
    if (sortType.comments_sort === 'time_desc') {
      response.sort((a, b) => b.userResponseAt.getTime() - a.userResponseAt.getTime()); // Compare timestamps
    }

    return response;
  }

  async updateRequest(updateRequestDto: UpdateRequestDto) {
    const rating = await this.prismaService.ratings.update({
      where: {
        id: updateRequestDto.id
      },
      data: {
        request: updateRequestDto.request
      }
    });

    if (!rating) {
      return {
        status: 500,
        message: 'Internal Server Error'
      }
    }

    return rating;
  }

}
