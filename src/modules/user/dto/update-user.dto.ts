import { IsNotEmpty } from "class-validator";
import { Length } from "class-validator";
import { Matches } from "class-validator";
import { IsString, IsEmail, IsPhoneNumber, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
export class UpdateUserDto {
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
        example: "+23411122233344"
    })
    @IsNotEmpty()
    @Length(3, 255)
    @IsPhoneNumber('NG') // Assuming Nigerian phone number
    phone: string;

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
}
