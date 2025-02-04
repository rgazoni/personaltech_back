import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { validateCref } from 'src/utils/puppeteer';
import { ValidateCrefEvent } from '../events/validate-cref.event';
import { PrismaService } from 'src/prisma.service';
import { JuridicalCref } from '../types/validate-cref.types';
import { Cref } from '@prisma/client';

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

      //Verify if cref is already in the database

      const cref_exists = await this.prismaService.cref.findUnique({
        where: { cref: cref },
      });

      if (cref_exists) {
        await this.prismaService.personal.update({
          where: { id: personal_id },
          data: {
            is_cref_verified: 'already_registered',
            cref
          },
        });
        return
      }

      // If the personal data exists, update it, otherwise create it

      const personal_data_exists = await this.prismaService.cref.findUnique({
        where: { personal_id: personal_id },
      });

      if (personal_data_exists) {
        await this.prismaService.cref.update({
          where: { personal_id: personal_id },
          data: cref_data,
        });
        await this.prismaService.personal.update({
          where: { id: personal_id },
          data: {
            is_cref_verified: 'valid',
            cref
          },
        });
      } else {
        console.log("CREATING CREF");
        await this.prismaService.cref.create({
          data: cref_data,
        });
        await this.prismaService.personal.update({
          where: { id: personal_id },
          data: {
            is_cref_verified: 'valid',
            cref
          },
        });
      }

      //TODO: Create transaction to ensure that both log and cref are created
      await this.prismaService.log.create({
        data: {
          type: 'cref.validation_queue',
          meta: { cref: cref, type: type },
          status: 'success',
        },
      });

    } catch (error) {
      console.error("IT FAILED", error);
      await this.prismaService.log.create({
        data: {
          type: 'cref.validation_queue',
          meta: { cref, error },
          status: 'failed',
        },
      });

      await this.prismaService.personal.update({
        where: { id: personal_id },
        data: {
          is_cref_verified: 'invalid',
          cref
        },
      });
    }
  }
}
