import { IsString, Length } from "class-validator";

export class CreateAuthDto{

    @Length(3, 255)
    @IsString()
    user_id: string

    @Length(3, 255)
    @IsString()
    access_token: string

}