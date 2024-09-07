import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { validateCref } from 'src/utils/puppeteer';
import { ValidateCrefEvent } from '../events/validate-cref.event';
import { PrismaService } from 'src/prisma.service';
import { JuridicalCref } from '../types/validate-cref.types';
import { Cref, Prisma } from '@prisma/client';

@Processor('cref')
export class CrefProcessor {
  constructor(private readonly prismaService: PrismaService) { }

  @Process('validate')
  async handleValidateCrefJob(job: Job<ValidateCrefEvent>) {
    const { cref, type, personal_id } = job.data;
    try {
      const data: JuridicalCref = await validateCref(cref, type);
      const cref_data: Cref = {
        ...data,
        cref,
        type: type,
        personal_id,
      };

      await this.prismaService.cref.create({
        data: cref_data,
      });

      await this.prismaService.personal.update({
        where: { id: personal_id },
        data: {
          is_cref_verified: 'valid',
        },
      });

      //TODO: Create transaction to ensure that both log and cref are created
      await this.prismaService.log.create({
        data: {
          type: 'cref.validation_queue',
          meta: { cref: cref, type: type },
          status: 'success',
        },
      });

    } catch (error) {
      await this.prismaService.log.create({
        data: {
          type: 'cref.validation_queue',
          meta: { cref, error },
          status: 'failed',
        },
      });
      // If the error is a unique constraint violation,
      // we update the user's is_cref_verified field to 'already_registered'
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        await this.prismaService.personal.update({
          where: { id: personal_id },
          data: {
            is_cref_verified: 'already_registered',
          },
        });
      } else {
        await this.prismaService.personal.update({
          where: { id: personal_id },
          data: {
            is_cref_verified: 'invalid',
          },
        });
      }
    }
  }
}
