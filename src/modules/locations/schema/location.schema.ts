// user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Location extends Document {
  @Prop({ required: true })
  admin_id: string;

  @Prop({ required: true, unique: true })
  state: string;

  @Prop({ type: String, required: true })
  city: "all" | "some";


  @Prop({ type: [String], default: [] })
  cart: string[];
}

export const LocationSchema = SchemaFactory.createForClass(Location);
