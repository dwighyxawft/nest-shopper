import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("reset/password")
  public async resetPassword(@Body() body: {email: string}){
    return this.appService.resetPassword(body.email);
  }

  @Post("password/reset")
  public async PasswordReset(@Body() body: {new_pass: string, confirm_pass, id: string}){
    return this.appService.passwordReset(body);
  }

  @Post("mail")
  public async sendMail(@Body() body: {email: string, body: string, subject: string}){
    return this.appService.sendMail(body.email, body.body, body.subject);
  }
}
