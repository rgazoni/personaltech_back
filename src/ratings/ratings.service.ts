import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RequestStatus } from '@prisma/client';
import { UpdateRequestDto } from './dto/update-request.dto';

@Injectable()
export class RatingsService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(createRatingDto: CreateRatingDto) {

    const rating = await this.prismaService.ratings.create({
      data: {
        trainee_id: createRatingDto.trainee_id,
        personal_id: createRatingDto.personal_id,
      }
    });

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
        id: trainee.id,
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
        id: personal.personal_id,
        page_name: personal.page_name,
        url: personal.url,
        avatar: personal.avatar
      }
    }))

    return response
  }

  async delete(personal_id: string, trainee_id: string) {
    const rating = await this.prismaService.ratings.delete({
      where: {
        trainee_id_personal_id: {
          trainee_id,
          personal_id,
        }
      }
    });

    console.log(rating)

    if (!rating) {
      return {
        status: 500,
        message: 'Internal Server Error'
      }
    }

    return rating

  }

  async update(updateRatingDto: UpdateRatingDto) {
    console.log(updateRatingDto)
    const rating = await this.prismaService.ratings.update({
      where: {
        trainee_id_personal_id: {
          trainee_id: updateRatingDto.trainee_id,
          personal_id: updateRatingDto.personal_id
        },
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
    console.log(status, token)
    const ratings = await this.prismaService.ratings.findMany({
      where: {
        request: status,
        personal_id: token
      }
    });

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

    const response = trainees.map((trainee) => {
      const rating = ratings.find(rating => rating.trainee_id === trainee.id);
      return {
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
        trainee_id_personal_id: {
          trainee_id: updateRequestDto.trainee_id,
          personal_id: updateRequestDto.personal_id
        }
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
