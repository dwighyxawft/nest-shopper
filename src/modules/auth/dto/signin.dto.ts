import { IsNotEmpty } from "class-validator";
import { Length } from "class-validator";
import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {

    @ApiProperty({
        description: "The user email",
        example: 'xawftly@gmail.com'
      })
    @IsNotEmpty()
    @Length(3, 255)
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "The password of the user",
        example: 'Password123?!'
      })
    @IsNotEmpty()
    @Length(3, 255)
    @IsString()
    password: string;
    
}
