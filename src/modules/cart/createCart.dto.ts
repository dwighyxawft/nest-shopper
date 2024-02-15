import { IsNotEmpty } from "class-validator";
import { Length } from "class-validator";
import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

    export class AddToCartDto {

        @ApiProperty({
            description: "The id of the product to be added to the cart",
            example: 'abcdefghijklmnopqrstuvw'
          })
        @IsNotEmpty()
        @IsString()
        @Length(3, 255)
        productId: string;
    
        @ApiProperty({
            description: "The quantity of the product you want to buy",
            example: 4
          })
        @IsNotEmpty()
        @IsNumber()
        @Length(3, 255)
        quantity: number;

        price: number;

        total: number;
    
    }
