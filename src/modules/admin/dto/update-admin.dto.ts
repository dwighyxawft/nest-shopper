import { IsNotEmpty } from "class-validator";
import { Length } from "class-validator";
import { Matches } from "class-validator";
import { IsString, IsEmail, IsPhoneNumber, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
export class UpdateAdminDto {
    @ApiProperty({
        description: "The name of the admin",
        example: "Dwight xawft"
    })
    @IsNotEmpty()
    @Length(3, 255)
    @IsString()
    name: string;

    @ApiProperty({
        description: "The email of the admin",
        example: "xawftly@gmail.com"
    })
    @IsNotEmpty()
    @Length(3, 255)
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "The phone number of the admin",
        example: "+23411122233344"
    })
    @IsNotEmpty()
    @Length(3, 255)
    @IsPhoneNumber('NG') // Assuming Nigerian phone number
    phone: string;

    @ApiProperty({
        description: "The residential address of the admin",
        example: "17, ABC street, Block EFG, HIJK Bus stop"
    })
    @IsNotEmpty()
    @Length(3, 255)
    @IsString()
    address: string;

    @ApiProperty({
        description: "The residential state of the admin",
        example: "Lagos"
    })
    @IsNotEmpty()
    @Length(3, 255)
    @IsString()
    state: string;

    @ApiProperty({
        description: "The city of the admin",
        example: "Ikeja"
    })
    @IsNotEmpty()
    @Length(3, 255)
    @IsString()
    city: string;
}
