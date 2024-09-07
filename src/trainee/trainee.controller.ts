import { Body, Controller, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { TraineeService } from './trainee.service';
import { CreateTraineeDto } from './dto/create-trainee.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateTraineeDto } from './dto/update-trainee.dto';

@Controller('trainee')
export class TraineeController {
  constructor(
    private readonly traineeService: TraineeService,
  ) { }

  @Post('create')
  @UseInterceptors(FileInterceptor('avatar'))
  create(
    @Body() createTraineeDto: CreateTraineeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.traineeService.create(createTraineeDto, file);
  }

  @Get('q/')
  findQuery(@Query('query') query: string) {
    return this.traineeService.findQuery(query);
  }

  @Post('change/password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.traineeService.changePassword(changePasswordDto);
  }

  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.traineeService.findUnique(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTraineeDto: UpdateTraineeDto) {
    return this.traineeService.update(id, updateTraineeDto);
  }

}
