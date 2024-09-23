import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ClassesService, PrismaService],
  controllers: [ClassesController]
})
export class ClassesModule { }
