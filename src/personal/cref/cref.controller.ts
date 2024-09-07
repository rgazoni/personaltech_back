import { Controller, Get, Query } from '@nestjs/common';
import { GetCrefDto } from './dto/get-cref.dto';
import { CrefService } from './cref.service';

@Controller('personal/cref')
export class CrefController {
  constructor(private readonly crefService: CrefService) { }

  @Get('')
  create(@Query() getCrefDto: GetCrefDto) {
    return this.crefService.getCref(getCrefDto);
  }

  @Get('status')
  status(@Query() getCrefDto: GetCrefDto) {
    return this.crefService.getStatus(getCrefDto);
  }

}
