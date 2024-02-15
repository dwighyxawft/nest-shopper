// user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';

@Schema({ timestamps: true })
export class Pass extends Document {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true, unique: true })
  uuid: string;

  createdAt: Date

}

export const PassSchema = SchemaFactory.createForClass(Pass);
