import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RequestStatus } from '@prisma/client';
import { UpdateRequestDto } from './dto/update-request.dto';

@Controller('ratings')
export class RatingsController {
  constructor(
    private readonly ratingsService: RatingsService,
  ) { }

  @Post('create')
  create(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.create(createRatingDto);
  }

  @Get('personal')
  getPersonalRatings(@Param('token') token: string) {
    return this.ratingsService.getPersonalRatings(token);
  }


  @Get('personal/pending')
  getPersonalPending(@Param('token') token: string) {
    return this.ratingsService.getPersonalPending(token);
  }

  @Get('trainee')
  getTraineeRatings(@Param('token') token: string) {
    return this.ratingsService.getTraineeRatings(token);
  }

  @Delete('delete')
  delete(@Query('id') id: string) {
    return this.ratingsService.delete(id);
  }

  @Put('update')
  update(@Body() updateRatingDto: UpdateRatingDto) {
    return this.ratingsService.update(updateRatingDto);
  }

  @Put('update/request')
  request(@Body() updateRequestDto: UpdateRequestDto) {
    return this.ratingsService.updateRequest(updateRequestDto);
  }

  @Get('info')
  info(@Query('status') status: RequestStatus, @Query('token') token: string) {
    return this.ratingsService.info(status, token);
  }

}
