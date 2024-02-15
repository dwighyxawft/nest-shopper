import { Module } from '@nestjs/common';
import { NotoficationsService } from './notifications.service';
import { NotoficationsController } from './notifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema } from './schemas/notifications.schema';

@Module({
  controllers: [NotoficationsController],
  providers: [NotoficationsService],
  imports: [MongooseModule.forFeature([
    {
      name: "Notification",
      schema: NotificationSchema
    }
  ])],
  exports: [NotoficationsService]
})
export class NotoficationsModule {}
