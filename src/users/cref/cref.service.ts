import { Injectable } from '@nestjs/common';
import { ValidateCrefDto } from './dto/validate-cref.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class CrefService {
  constructor(@InjectQueue('cref') private readonly crefQueue: Queue) { }

  async validate(validate: ValidateCrefDto) {
    await this.crefQueue.add('validate', {
      cref: validate.cref,
      type: validate.type,
      user_id: validate.user_id,
    },
      {
        timeout: 120000,
        attempts: 3, // Retry failed jobs up to 3 times
      }
    );
  }
}
