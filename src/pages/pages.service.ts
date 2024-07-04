import { Injectable } from '@nestjs/common';
import { UrlDto } from './dto/url.dto';
import { CreatePageDto } from './dto/create-page.dto';
import { Prisma } from '@prisma/client';
import { handlePrismaKnownError } from 'src/common/util/prisma-error.util';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) { }

  findUrls(url: string): UrlDto {
    return {
      url,
    };
  }

  async create(createPageDto: CreatePageDto) {
    try {
      const page_created = await this.prisma.page.create({
        data: createPageDto,
      });
      return page_created;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaKnownError(e);
      }
      throw e;
    }
  }
}
