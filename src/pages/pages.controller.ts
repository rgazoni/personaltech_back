import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UrlDto } from './dto/url.dto';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) { }

  @Get('url')
  findUrls(@Query() query: UrlDto) {
    const { url = '' } = query;
    return this.pagesService.findUrls(url);
  }

  @Post('create')
  create(@Body() createPageDto: CreatePageDto) {
    return this.pagesService.create(createPageDto);
  }
}
