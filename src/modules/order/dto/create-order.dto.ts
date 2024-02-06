// create-order.dto.ts

import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsNumber()
  total: number;
}

export class CreateOrderDto {
  @IsString()
  user_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  products: OrderItemDto[];

  @IsNumber()
  total: number;

  @IsString()
  reference: string;

  @IsString()
  userEmail: string;

  @IsString()
  paymentStatus: string;
}
