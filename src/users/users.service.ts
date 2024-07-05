import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, User } from '@prisma/client';
import { handlePrismaKnownError } from 'src/common/util/prisma-error.util';
import { CrefService } from './cref/cref.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crefService: CrefService,
  ) { }

  async create(user: CreateUserDto): Promise<Omit<User, 'password'>> {
    try {
      const user_created = await this.prisma.user.create({
        omit: {
          password: true,
        },
        data: {
          email: user.email,
          password: user.password,
          cref: user.cref,
        }
      });

      await this.crefService.validate({
        cref: user.cref,
        type: user.type,
        user_id: user_created.id,
      });

      return user_created;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaKnownError(e);
      }
      throw e;
    }
  }
}
