// order.model.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

// Order Item Schema
@Schema()
export class OrderItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  total: number;
}

// Main Order Schema
@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop({ type: [OrderItem], required: true })
  products: OrderItem[];

  @Prop({ type: Number, required: true })
  total: number;

  @Prop({ required: true, unique: true })
  reference: string;

  @Prop({ required: true })
  userEmail: string;

  @Prop({ type: String, enum: ['pending', 'completed'], default: 'pending' })
  paymentStatus: string;

  // Add other order-related fields as needed
}

export const OrderSchema = SchemaFactory.createForClass(Order);
