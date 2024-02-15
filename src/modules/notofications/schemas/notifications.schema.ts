// user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {

  @Prop({ required: true })
  body: string;

  order_id: string;

  product_id: string;

  status: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
