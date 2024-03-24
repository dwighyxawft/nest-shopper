import { Length, IsString, IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateProductDto{

    @ApiProperty({
        description: "The name of the product",
        example: "Fish"
    })
    @IsString()
    @Length(3, 50)
    @IsNotEmpty()
    name: string

    @ApiProperty({
        description: "The product description",
        example: "fishes from the river"
    })
    @IsString()
    @Length(3, 100)
    @IsNotEmpty()
    description: string

    @ApiProperty({
        description: "The product price",
        example: 30.00
    })
    @IsNumber()
    @Length(3, 50)
    @IsNotEmpty()
    price: number

    @ApiProperty({
        description: "The product category",
        example: "abcdefghijklmon"
    })
    @IsString()
    @Length(3, 50)
    @IsNotEmpty()
    category: string

    @ApiProperty({
        description: "The product group",
        example: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    })
    @IsString()
    @Length(3, 50)
    @IsNotEmpty()
    group: string

    @ApiProperty({
        description: "The product quantity available in your shop per unit",
        example: 50
    })
    @IsString()
    @Length(3, 50)
    @IsNotEmpty()
    origin: string

    @ApiProperty({
        description: "95% Rayon, 5% Spandex",
        example: 50
    })
    @IsString()
    @Length(3, 50)
    @IsNotEmpty()
    material: string

    @ApiProperty({
        description: "The product country of origin",
        example: "Nigeria"
    })
    @IsString()
    @Length(3, 50)
    @IsNotEmpty()
    care: string

    @ApiProperty({
        description: "The product care instructions",
        example: "store in a cool dry place"
    })
    @IsString()
    @Length(3, 50)
    @IsNotEmpty()
    size: string

    @ApiProperty({
        description: "The product size",
        example: "Medium"
    })
    @IsNumber()
    @Length(3, 50)
    @IsNotEmpty()
    quantity: number

    @ApiProperty({
        description: "The product description",
        example: "fish, river, food, eat, swim, ponds, lake, shop"
    })
    keyword: string
    keywords: string[]
    
    
    images: string[]


}