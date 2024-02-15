import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { INote } from './interface/notifications.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NotoficationsService {
  constructor(@InjectModel("Notification") private readonly noteModel: Model<INote>){}

  public async createNotification(notification: CreateNotificationDto) {
      if((!notification.order_id || notification.order_id == undefined) && (!notification.product_id || notification.product_id == undefined)){
        notification.order_id = notification.product_id = "admin";
      }else if((!notification.order_id || notification.order_id == undefined) && (notification.product_id)){
        notification.order_id = "admin";
      }else if((!notification.product_id || notification.product_id == undefined) && (notification.order_id)){
        notification.product_id = "admin";
      }
      notification.status = "unread";
      const newNote = await new this.noteModel(notification);
      if(await newNote.save()){
          return {message: "Notification has been saved successfully"};
      }
  }

  public async getNotifications() {
    const notifications = await this.noteModel.find().exec();
    return {notifications};
  }

  public async getNotificationById(id: string) {
    const notification = await this.noteModel.findOne({_id: id}).exec();
    return {notification};
  }

  public async deleteNotificationById(id: string) {
    return await this.noteModel.deleteOne({_id: id}).exec();
  }
}
