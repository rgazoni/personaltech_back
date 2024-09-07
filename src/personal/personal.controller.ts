import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { Personal } from '@prisma/client';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { CreatePersonalResponseDto } from './dto/create-personal-response.dto';

@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) { }

  @Post('create')
  create(@Body() createUserDto: CreatePersonalDto): Promise<CreatePersonalResponseDto> {
    return this.personalService.create(createUserDto);
  }

  @Get()
  getMe(@Query('token') token: string): Promise<Omit<Personal, 'password'>> {
    return this.personalService.getMe(token);
  }

}
