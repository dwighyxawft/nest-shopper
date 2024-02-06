import { IsString, IsNotEmpty } from "class-validator";
import { CreateCategoryDto } from "./createCategory.dto";

export class UpdateCategoryDto extends CreateCategoryDto{
    
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    description: string

}