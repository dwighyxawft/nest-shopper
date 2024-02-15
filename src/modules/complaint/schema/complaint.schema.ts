// user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Complaint extends Document {

  @Prop({ required: true })
  body: string;

  subject: string;

  name: string;

  email: string;
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);
