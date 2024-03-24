// product.model.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ type: String })
  category: string;

  @Prop({ type: String })
  group: string;

  @Prop({ type: String })
  size: string;

  @Prop({ type: String })
  origin: string;

  @Prop({ type: String })
  care: string;

  @Prop({ type: String })
  material: string;

  @Prop({ required: true, type: Number })
  quantity: number;

  @Prop({ type: [String], default: [] })
  keywords: string[];

  @Prop({ type: [String], default: [] })
  images: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
