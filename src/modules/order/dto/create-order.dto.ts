// create-order.dto.ts

import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({
    description: "The user making the order",
    example: '123456789103yffmvjbjmxnknd'
  })
  @IsString()
  user_id: string;

  @ApiProperty({
    description: "The order products",
    example: [{productId: "aaaaaaaaaaaaaaaa", quantity: 4, price: 30, total: 120}, {productId: "aaaaaaaaaaaaaaaa", quantity: 4, price: 30, total: 120} ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  products: OrderItemDto[];

  @ApiProperty({
    description: "The total amount of the order",
    example: 240
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    description: "The paystack reference of the order payment",
    example: '123456789103yffmvjbjmxnknd'
  })
  @IsString()
  reference: string;

  @ApiProperty({
    description: "The email of the user making the order",
    example: 'xawftly@gmail.com'
  })
  @IsString()
  userEmail: string;

  @IsString()
  paymentStatus: string;
  state: string;
  city: string;
  address: string;
  delivery: boolean;
  delivered: boolean;
}
