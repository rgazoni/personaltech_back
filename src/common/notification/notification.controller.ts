import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService
  ) { }

  @Get(':personal_id')
  getNotifications(@Param('personal_id') personal_id: string) {
    return this.notificationService.getNotifications(personal_id);
  }

  @Put()
  markAsRead(@Query('ids') ids: string) {
    const nids = ids.split(',');
    return this.notificationService.markAsRead(nids);
  }

}
