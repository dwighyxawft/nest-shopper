// user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Courier extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  city: string;

}

export const CourierSchema = SchemaFactory.createForClass(Courier);
