import { IsNotEmpty } from "class-validator";
import { Length } from "class-validator";
import { Matches } from "class-validator";
import { IsString, IsEmail, IsPhoneNumber, IsNumber, IsArray, ValidateNested } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @Length(3, 255)
    @IsString()
    name: string;

    @IsNotEmpty()
    @Length(3, 255)
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(3, 255)
    @IsPhoneNumber('NG') // Assuming Nigerian phone number
    phone: string;

    @IsNotEmpty()
    @Length(3, 255)
    gender: "male" | "female";

    @IsNotEmpty()
    @Length(3, 255)
    image: "male.jpg" | "female.jpg";

    @IsNotEmpty()
    @Length(3, 255)
    @IsString()
    address: string;

    @IsNotEmpty()
    @Length(3, 255)
    @IsString()
    state: string;

    @IsNotEmpty()
    @Length(3, 255)
    @IsString()
    city: string;

    @IsNotEmpty()
    @Length(8, 24)
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message: "Password must have 1 uppercase, lowercase letter along with a number and a special character"
    })
    password: string;

    @IsNotEmpty()
    @Length(8, 24)
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message: "Password must have 1 uppercase, lowercase letter along with a number and a special character"
    })
    confirm: string;
}
