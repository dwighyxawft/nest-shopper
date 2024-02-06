import { IsNotEmpty } from "class-validator";
import { Length } from "class-validator";
import { IsString, IsEmail } from 'class-validator';

export class SignInDto {

    @IsNotEmpty()
    @Length(3, 255)
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(3, 255)
    @IsString()
    password: string;
    
}
