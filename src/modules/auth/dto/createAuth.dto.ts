import { IsString, Length } from "class-validator";

export class CreateAuthDto{

    user_id: string
    admin_id: string
    courier_id: string

    @Length(3, 255)
    @IsString()
    access_token: string

}