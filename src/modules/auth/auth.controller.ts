import { Controller, Body, Post, Res, Render, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('')
    signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) response: Response) {
        return this.authService.createToken(signInDto.email, signInDto.password, response);
    }

    @Get("")
    @Render("login")
    login(): {message: string} {
        return this.authService.login();
    }

}
