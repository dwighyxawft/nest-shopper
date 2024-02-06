import { IsString, IsNotEmpty } from "class-validator";
import { CreateGroupDto } from "./create-group.dto";

export class UpdateGroupDto extends CreateGroupDto{
    
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    description: string

}