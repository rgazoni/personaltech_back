import { Controller, Post } from '@nestjs/common';
import { CrefService } from './cref.service';

@Controller('cref')
export class CrefController {
  constructor(private readonly crefService: CrefService) { }

  @Post('validate')
  validate() {
    return this.crefService.validate();
  }

}
