import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { NotoficationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Notifications")
@Controller('notifications')
export class NotoficationsController {
  constructor(private readonly notoficationsService: NotoficationsService) {}

  @Post()
  create(@Body() createNotoficationDto: CreateNotificationDto) {
    return this.notoficationsService.createNotification(createNotoficationDto);
  }

  @Get()
  findAll() {
    return this.notoficationsService.getNotifications();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notoficationsService.getNotificationById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notoficationsService.deleteNotificationById(id);
  }
}
