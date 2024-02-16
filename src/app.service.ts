import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserService } from './modules/user/user.service';
import * as nodemailer from "nodemailer";
import {v4 as uuidv4} from "uuid"
import IPass from './interface/password.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AppService {
  private transporter = nodemailer.Transporter;
  constructor(private userService: UserService, @InjectModel("Pass") private readonly passModel: Model<IPass>){
    this.transporter = nodemailer.createTransport({
      host: 'smtp-relay.sendinblue.com', // Your SMTP server host
      port: 587, // Your SMTP server port
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'amuoladipupo@gmail.com', // Your SMTP username
        pass: 'bXfgDO2VMpZGFE19', // Your SMTP password
      },
    })
  }
  getHello(): string {
    return 'Hello World!';
  }

  public async resetPassword(email: string){
    const user = await this.userService.findOne(email);
    const uuid = uuidv4();
    if(user){
      if(await this.transporter.sendMail({from: 'amuoladipupo420@gmail.com', to: email, subject: "Reset your password", text: "Reset your password with this link, If link is not clickable, copy the link and paste it in your browser" + "https://shop.onrender.com/password/reset/"+uuid})){
          const checkPass = await this.passModel.findOne({user_id: user._id}).exec();
          if(!checkPass){
            const newPass = await new this.passModel({user_id: user._id, uuid: uuid, createdAt: Date.now()});
            if(await newPass.save()){
              return {message: "A link has been sent to your email for you to recover your account"}
            }
          }else{
            if(await this.passModel.updateOne({user_id: user._id}, {uuid: uuid, createdAt: Date.now()}).exec()){
              return {message: "A link has been sent to your email for you to recover your account"}
            }
          }
          if(await this.userService.updatePass(user._id, "")){

          }
      }
    }else{
      return {message: "User does not exist"}
    }
  }

  public async passwordReset(body){
    if(body.new_pass === body.confirm_pass){
      if(await this.userService.updatePass(body.id, body.new_pass)){
        return {message: "Your password has been updated. Proceed to login"};
      }
    }
  }

  public async sendMail(email: string, body: string, subject: string){
    if(await this.transporter.sendMail({from: 'amuoladipupo420@gmail.com', to: email, subject: subject, text: body})){
          return {message: "Your mail has been sent to the user"};
      }
  }
}
