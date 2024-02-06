import { IsNotEmpty } from "class-validator";
import { Length } from "class-validator";
import { IsString, IsNumber } from 'class-validator';

    export class AddToCartDto {
        @IsNotEmpty()
        @IsString()
        @Length(3, 255)
        productId: string;
    
        @IsNotEmpty()
        @IsNumber()
        @Length(3, 255)
        quantity: number;

        price: number;

        total: number;
    
    }
