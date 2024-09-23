import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { Classes } from '@prisma/client';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) { }

  @Post('create')
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get('personal')
  getPersonalClasses(@Query('token') token: string) {
    return this.classesService.getPersonalClasses(token);
  }

  @Delete('delete')
  delete(@Query('class_id') class_id: string) {
    console.log(class_id);
    return this.classesService.delete(class_id);
  }

  @Get('trainee')
  getTraineeClasses(@Query('token') token: string) {
    return this.classesService.getTraineeClasses(token);
  }

  @Get('trainee/responses')
  getTraineeResponses(@Query('id') id: string, @Query('status') status: string) {
    return this.classesService.getTraineeResponses(id, status);
  }

  @Put('update')
  update(@Body() updateClass: Partial<Classes>) {
    console.log(updateClass);
    return this.classesService.update(updateClass.id, updateClass.status, updateClass.elapsed_time);
  }
}
