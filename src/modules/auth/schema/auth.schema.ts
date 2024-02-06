// auth.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Auth extends Document {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true, unique: true })
  access_token: string;


}

export const AuthSchema = SchemaFactory.createForClass(Auth);
