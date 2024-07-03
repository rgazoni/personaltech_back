import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { handlePrismaKnownError } from 'src/common/util/prisma-error.util';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(user: CreateUserDto): Promise<CreateUserDto> {
    try {
      const user_created = await this.prisma.user.create({
        data: user,
      });

      //TODO: Serialize decorator to hide password
      delete user_created.password;

      return user_created;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaKnownError(e);
      }
      throw e;
    }
  }
}
