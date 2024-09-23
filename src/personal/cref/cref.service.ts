import { Injectable } from '@nestjs/common';
import { ValidateCrefDto } from './dto/validate-cref.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { GetCrefDto } from './dto/get-cref.dto';
import { PrismaService } from 'src/prisma.service';
import { GetCrefResponseDto } from './dto/get-cref-response.dto';
import { CrefOpts } from '@prisma/client';
import { RenewCrefDto } from './dto/renew-cref.dto';

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
        timeout: 240000,
        attempts: 1, // Retry failed jobs up to 3 times
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

  async getStatus(id: string) {

    const personal = await this.prismaService.personal.findUnique({
      where: {
        id,
      }
    });

    if (!personal) {
      throw new Error('CREF not found');
    }

    if (personal.is_cref_verified === CrefOpts.valid) {
      const result = await this.getCref({ cref: personal.cref });
      return {
        name: result.name,
        status: personal.is_cref_verified,
      }
    }

    return {
      status: personal.is_cref_verified,
    }
  }

  async renewCref(newCrefDto: RenewCrefDto) {
    const crefFormatted = newCrefDto.type === 'fisica' ?
      newCrefDto.cref.slice(0, 6) + '-' + newCrefDto.cref.slice(6, 7) + '/' + newCrefDto.cref.slice(7) :
      newCrefDto.cref.slice(0, 6) + '-' + newCrefDto.cref.slice(6, 8) + '/' + newCrefDto.cref.slice(8);

    await this.prismaService.personal.update({
      where: { id: newCrefDto.personal_id },
      data: {
        is_cref_verified: 'pending',
      }
    });

    await this.validate({
      cref: crefFormatted,
      type: newCrefDto.type === 'fisica' ? 'natural' : 'juridical',
      personal_id: newCrefDto.personal_id,
    });

    return {
      message: 'Cref validation requested',
    }
  }

}
