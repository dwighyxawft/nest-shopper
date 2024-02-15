// verification.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';

@Schema({ timestamps: true })
export class Verify extends Document {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true, unique: true })
  uuid: string;

  createdAt: Date

}

export const VerifySchema = SchemaFactory.createForClass(Verify);
