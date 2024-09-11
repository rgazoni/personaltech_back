import { Body, Controller, Post } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { VisitorsService } from './visitors.service';

@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) { }

  @Post('/track')
  async create(
    @Body() createVisitorDto: CreateVisitorDto,
  ) {
    const shouldTrack = await this.visitorsService.trackVisitor(createVisitorDto.visitor_id, createVisitorDto.page_id, createVisitorDto.type);

    if (!shouldTrack) {
      return { message: 'Visit already tracked in the last 10 minutes' };
    }

    await this.visitorsService.create(createVisitorDto);
    return { message: 'Visit tracked successfully' };

  }

}
