import { Length, IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateNotificationDto{

    @ApiProperty({
        description: "The notification body",
        example: 'Body of the notification to the admin'
      })
    @IsString()
    @Length(3, 50)
    @IsNotEmpty()
    body: string

    @ApiProperty({
        description: "Order id of an order that has just been made",
        example: '123456789103yffmvjbjmxnknd'
      })
    order_id: "admin" | string

    @ApiProperty({
        description: "Product Id that is almost out of stock",
        example: '123456789103yffmvjbjmxnknd'
      })
    product_id: "admin" | string

    status: "unread" | "read";

}