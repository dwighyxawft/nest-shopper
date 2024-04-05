import { IsNotEmpty } from "class-validator";
import { Length } from "class-validator";
import { Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateAdminPassDto {

    @ApiProperty({
        description: "The new password of the admin",
        example: "Password123?!"
    })
    @IsNotEmpty()
    @Length(8, 24)
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message: "Password must have 1 uppercase, lowercase letter along with a number and a special character"
    })
    new_pass: string;

    @ApiProperty({
        description: "The confirmation password of the admin",
        example: "Password123?!"
    })
    @IsNotEmpty()
    @Length(8, 24)
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message: "Password must have 1 uppercase, lowercase letter along with a number and a special character"
    })
    confirm: string;
}
