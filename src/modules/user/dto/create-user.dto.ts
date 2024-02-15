import { IsNotEmpty } from "class-validator";
import { Length } from "class-validator";
import { Matches } from "class-validator";
import { IsString, IsEmail, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({
        description: "The name of the user",
        example: "Dwight xawft"
    })
    @IsNotEmpty()
    @Length(3, 255)
    @IsString()
    name: string;

    @ApiProperty({
        description: "The email of the user",
        example: "xawftly@gmail.com"
    })
    @IsNotEmpty()
    @Length(3, 255)
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "The phone number of the user",
        example: "+2348181107488"
    })
    @IsNotEmpty()
    @Length(3, 255)
    @IsPhoneNumber('NG') // Assuming Nigerian phone number
    phone: string;

    @ApiProperty({
        description: "The gender of the user",
        example: "male"
    })
    @IsNotEmpty()
    @Length(3, 255)
    gender: "male" | "female";

    @IsNotEmpty()
    @Length(3, 255)
    image: "male.jpg" | "female.jpg";

    @ApiProperty({
        description: "The residential address of the user for order deliveries",
        example: "17, ABC street, Block EFG, HIJK Bus stop"
    })
    @IsNotEmpty()
    @Length(3, 255)
    @IsString()
    address: string;

    @ApiProperty({
        description: "The residential state of the user",
        example: "Lagos"
    })
    @IsNotEmpty()
    @Length(3, 255)
    @IsString()
    state: string;

    @ApiProperty({
        description: "The city of the user",
        example: "Ikeja"
    })
    @IsNotEmpty()
    @Length(3, 255)
    @IsString()
    city: string;

    @ApiProperty({
        description: "The password of the user",
        example: "Password123?!"
    })
    @IsNotEmpty()
    @Length(8, 24)
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message: "Password must have 1 uppercase, lowercase letter along with a number and a special character"
    })
    password: string;

    @ApiProperty({
        description: "The confirmation password of the user",
        example: "Password123?!"
    })
    @IsNotEmpty()
    @Length(8, 24)
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message: "Password must have 1 uppercase, lowercase letter along with a number and a special character"
    })
    confirm: string;
}
