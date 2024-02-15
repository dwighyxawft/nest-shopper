import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateGroupDto{
    
    @ApiProperty({
        description: "The group name",
        example: 'T-shirts'
      })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({
        description: "The group description",
        example: 'This is the t-shirts group where you can find t-shirts'
      })
    @IsString()
    @IsNotEmpty()
    description: string

}