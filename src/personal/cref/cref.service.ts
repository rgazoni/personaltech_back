import { Injectable } from '@nestjs/common';
import { ValidateCrefDto } from './dto/validate-cref.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { GetCrefDto } from './dto/get-cref.dto';
import { PrismaService } from 'src/prisma.service';
import { GetCrefResponseDto } from './dto/get-cref-response.dto';
import { CrefOpts } from '@prisma/client';

@Injectable()
export class CrefService {
  constructor(@InjectQueue('cref') private readonly crefQueue: Queue,
    private readonly prismaService: PrismaService) { }

  async validate(validate: ValidateCrefDto) {
    await this.crefQueue.add('validate', {
      cref: validate.cref,
      type: validate.type,
      personal_id: validate.personal_id,
    },
      {
        timeout: 120000,
        attempts: 3, // Retry failed jobs up to 3 times
      }
    );
  }

  async getCref(getCrefDto: GetCrefDto): Promise<GetCrefResponseDto> {
    const cref = await this.prismaService.cref.findUnique({
      where: {
        cref: getCrefDto.cref,
      },
    });

    //THROW ERROR IF CREF NOT FOUND

    const name = cref.name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    ;

    const response = {
      cref: cref.cref,
      type: cref.type,
      name,
    }
    return response;
  }

  async getStatus(getCrefDto: GetCrefDto) {

    const personal = await this.prismaService.personal.findUnique({
      where: {
        cref: getCrefDto.cref,
      }
    });

    if (!personal) {
      throw new Error('CREF not found');
    }

    if (personal.is_cref_verified === CrefOpts.valid) {
      const result = await this.getCref(getCrefDto);
      return {
        name: result.name,
        status: personal.is_cref_verified,
      }
    }

    return {
      status: personal.is_cref_verified,
    }
  }

}
