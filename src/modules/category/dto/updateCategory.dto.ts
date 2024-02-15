import { IsString, IsNotEmpty } from "class-validator";
import { CreateCategoryDto } from "./createCategory.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCategoryDto extends CreateCategoryDto{
    
    @ApiProperty({
        description: "The category name",
        example: 'Men'
      })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({
        description: "The category description",
        example: 'This is the category of men products'
      })
    @IsString()
    @IsNotEmpty()
    description: string

}