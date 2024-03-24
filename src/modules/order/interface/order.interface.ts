// order.interface.ts

import { Date, Document, Types } from 'mongoose';

export interface IOrder extends Document {
  user_id: Types.ObjectId;
  products: {
    productId: Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  total: number;
  reference: string;
  userEmail: string;
  paymentStatus: string;
  state: string;
  city: string;
  address: string;
  delivery: boolean;
  delivered: boolean;
  createdAt: Date;
  updatedAt: Date;
}
