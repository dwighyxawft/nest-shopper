import { Length, IsString, IsNotEmpty, IsNumber } from "class-validator";
import { CreateProductDto } from "./createProduct.dto";
export class UpdateProductDto extends CreateProductDto{

    @IsString()
    @Length(3, 50)
    @IsNotEmpty()
    name: string

    @IsString()
    @Length(3, 100)
    @IsNotEmpty()
    description: string

    @IsNumber()
    @Length(3, 50)
    @IsNotEmpty()
    price: number

    @IsString()
    @Length(3, 50)
    @IsNotEmpty()
    category: string

    @IsString()
    @Length(3, 50)
    @IsNotEmpty()
    group: string

    @IsNumber()
    @Length(3, 50)
    @IsNotEmpty()
    quantity: number

    keyword: string
    keywords: string[]
    

    images: string[]


}