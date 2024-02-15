import { IsString, IsNotEmpty, IsEmail, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateComplaintDto {

    @ApiProperty({
        description: "The user email",
        example: 'xawftly@gmail.com'
      })
    @IsString()
    @Length(3, 20)
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "The user name",
        example: "xawft 123"
      })
    name: string;

    @ApiProperty({
        description: "The email title",
        example: 'My Email'
      })
    @IsString()
    @Length(3, 50)
    subject: string;

    @ApiProperty({
        description: "The email body",
        example: 'My email to you'
      })
    @IsString()
    @Length(10, 200)
    body: string;
}
