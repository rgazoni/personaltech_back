import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { GetCrefDto } from './dto/get-cref.dto';
import { CrefService } from './cref.service';
import { RenewCrefDto } from './dto/renew-cref.dto';

@Controller('personal/cref')
export class CrefController {
  constructor(private readonly crefService: CrefService) { }

  @Get('')
  create(@Query() getCrefDto: GetCrefDto) {
    return this.crefService.getCref(getCrefDto);
  }

  @Get('status')
  status(@Query('id') id: string) {
    return this.crefService.getStatus(id);
  }

  @Put('renew')
  renew(@Body() renewCrefDto: RenewCrefDto) {
    console.log(renewCrefDto);
    return this.crefService.renewCref(renewCrefDto);
  }

}
