import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Personal, Prisma } from '@prisma/client';
import { handlePrismaKnownError } from 'src/common/util/prisma-error.util';
import { CrefService } from './cref/cref.service';
import { Omit } from '@prisma/client/runtime/library';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { CreatePersonalResponseDto } from './dto/create-personal-response.dto';

@Injectable()
export class PersonalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crefService: CrefService,
  ) { }

  async create(personal: CreatePersonalDto): Promise<CreatePersonalResponseDto> {
    try {
      const personal_created = await this.prisma.personal.create({
        omit: {
          password: true,
        },
        data: {
          email: personal.email,
          password: personal.password,
          cref: personal.cref,
          state: personal.state,
          city: personal.city,
        }
      });

      await this.crefService.validate({
        cref: personal.cref,
        type: personal.type,
        personal_id: personal_created.id,
      });

      const personal_with_token = {
        token: personal_created.id,
        ...personal_created,
      }

      return personal_with_token;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaKnownError(e);
      }
      throw e;
    }
  }

  async getMe(token: string): Promise<Omit<Personal, 'password'>> {
    const user = await this.prisma.personal.findUnique({
      omit: {
        password: true,
      },
      where: {
        id: token,
      },
    });
    if (!user) {
      throw new NotFoundException(`User #${token} not found`);
    }
    return user;
  }

}
