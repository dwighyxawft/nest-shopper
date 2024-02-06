import { Controller, Body, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('')
    signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) response: Response) {
        return this.authService.createToken(signInDto.email, signInDto.password, response);
    }

}
