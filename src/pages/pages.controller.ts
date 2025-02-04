import { Body, Controller, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UrlDto } from './dto/url.dto';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SearchDto } from './dto/search-dto';
import { SortOptsDto } from './dto/sort-opts.dto';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) { }

  @Get()
  findAll() {
    return this.pagesService.findAll();
  }

  @Get('search')
  async search(@Query() query: SearchDto) {
    console.log('search', query.name, query.city, query.state, query.expertises);
    const data = await this.pagesService.search(query);
    if (query.rate) {
      return this.pagesService.sortPagesByRate(data, query.rate);
    }
    return data;
  }

  @Get(':page')
  findOne(@Param('page') url: string) {
    return this.pagesService.findOne(url);
  }

  @Get('id/:id')
  findOneById(@Param('id') id: string) {
    return this.pagesService.findOneById(id);
  }

  @Get('verify/url')
  findUrl(@Query() urlDto: UrlDto) {
    return this.pagesService.findUrl(urlDto);
  }

  @Post('create')
  create(@Body() createPageDto: CreatePageDto) {
    return this.pagesService.create(createPageDto);
  }

  @Put('update')
  @UseInterceptors(FileInterceptor('avatarFile'))
  update(@Body() updatePageDto: UpdatePageDto, @UploadedFile() file: Express.Multer.File) {
    return this.pagesService.update(updatePageDto, file)
  }

  @Put('rate/sort')
  rateSort(@Body() sortOptsDto: SortOptsDto) {
    return this.pagesService.rateSort(sortOptsDto);
  }

}
