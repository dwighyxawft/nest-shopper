import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from "bcryptjs";
import IUser from './interface/user.interface';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { UpdateUserPassDto } from './dto/update-pass.dto';
import IVerify from './interface/verification.interface';
import {v4 as uuidv4} from "uuid";
import * as nodemailer from "nodemailer"

@Injectable()
export class UserService {
  private transporter: nodemailer.Transporter;
  constructor(@InjectModel("User") private readonly userModel: Model<IUser>, @InjectModel("Verification") private readonly verifyModel: Model<IVerify>){
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
  public async register(userDetails: CreateUserDto) {
    const existingUser = await this.findOne(userDetails.email);
    const uuid = uuidv4();
      if(!existingUser){
        userDetails.image = userDetails.gender == "male" ? "male.jpg" : "female.jpg";
        if(userDetails.password === userDetails.confirm){
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(userDetails.password, salt);
            userDetails.password = hash;
            if(await this.transporter.sendMail({from: 'amuoladipupo420@gmail.com', to: userDetails.email, subject: "Verify your account", text: "Verify your account, If link is not clickable, copy the link and paste it in your browser" + "https://shop.onrender.com/user/verify/account/"+uuid})){
              const newUser = new this.userModel(userDetails);
              if(await newUser.save()){
                const newPin = await new this.verifyModel({user_id: newUser._id, uuid: uuid, createdAt: Date.now()});
                if(await newPin.save()){
                  return {message: "User registration successful. Open your email and click the link that has been sent to you"}
                }
              }
            }
        }else{
          return {message: "Passwords are not matching"}
        }
      }else if(existingUser && !existingUser.verified){
        const checkPin = await this.verifyModel.findOne({user_id: existingUser._id}).exec();
        const pin_length = Number(checkPin.createdAt) + (1000 * 60 * 60 * 6);
        if(!checkPin){
          if(await this.transporter.sendMail({from: 'amuoladipupo420@gmail.com', to: existingUser.email, subject: "Verify your account", text: "Verify your account, If link is not clickable, copy the link and paste it in your browser" + "https://shop.onrender.com/user/verify/account/"+uuid})){
            const newPin = await new this.verifyModel({user_id: existingUser._id, uuid: uuid, createdAt: Date.now()});
            if(await newPin.save()){
              return {message: "User registration successful. Open your email and click the link that has been sent to you"}
            }
          }
        }else if(checkPin && Date.now() <= pin_length){
          if(await this.transporter.sendMail({from: 'amuoladipupo420@gmail.com', to: existingUser.email, subject: "Verify your account", text: "Verify your account, If link is not clickable, copy the link and paste it in your browser" + "https://shop.onrender.com/user/verify/account/"+uuid})){
              return {message: "User registration successful. Open your email and click the link that has been sent to you"}
          }
        }else{
          if(await this.transporter.sendMail({from: 'amuoladipupo420@gmail.com', to: existingUser.email, subject: "Verify your account", text: "Verify your account, If link is not clickable, copy the link and paste it in your browser" + "https://shop.onrender.com/user/verify/account/"+uuid})){
            if(await this.verifyModel.updateOne({user_id: existingUser._id}, {uuid: uuid}).exec()){
              return {message: "User registration successful. Open your email and click the link that has been sent to you"}
            }
          }
        }

      }else{
        return {message: "User already exists"};
      }
      
  }

  public async findAll() {
    try{
        const user = await this.userModel.find().exec();
        return user;
    }catch(err){
      throw new HttpException({
        status: HttpStatus.SERVICE_UNAVAILABLE,
        error: 'Server Error, Please try again',
      }, HttpStatus.FORBIDDEN, {
        cause: err
      });
    }
  }

  public async findOne(email: string): Promise<User | undefined> {
    try{
        const user = await this.userModel.findOne({email: email}).exec();
        return user;
    }catch(err){
      throw new HttpException({
        status: HttpStatus.SERVICE_UNAVAILABLE,
        error: 'Server Error, Please try again',
      }, HttpStatus.FORBIDDEN, {
        cause: err
      });
    }
  }

  public async findById(id: string): Promise<User | undefined> {
    try{
        const user = await this.userModel.findOne({_id: id}).exec();
        return user;
    }catch(err){
      throw new HttpException({
        status: HttpStatus.SERVICE_UNAVAILABLE,
        error: 'Server Error, Please try again',
      }, HttpStatus.FORBIDDEN, {
        cause: err
      });
    }
  }

  public async verifyAccount(uuid: string){
    const checkPin = await this.verifyModel.findOne({uuid: uuid}).exec();
    if(checkPin){
      const pin_length = +checkPin.createdAt + (1000 * 60 * 60 * 6);
      if(Date.now() <= pin_length){
          if(await this.userModel.updateOne({_id: checkPin.user_id}, {verified: true}).exec()){
            if(await this.verifyModel.deleteOne({user_id: checkPin.user_id}).exec()){
              return {message: "User verification successful. You can now login to your account"}
            }
          }
      }else{
        return {message: "Link expired"};
      }
    }else{
      return {message: "This link does not exist"};
    }
  }

  public async updateCart(id: string, cart: any[]) {
    return this.userModel.updateOne({_id: id}, {cart: cart}).exec();
  }

  public async updateUserPassword(id: string, updatePassDto: UpdateUserPassDto){
      const user = await this.findById(id);
      if(user){
        if(await bcrypt.compare(updatePassDto.old_pass,user.password)){
            if(updatePassDto.new_pass === updatePassDto.confirm){
              if(await this.updatePass(user._id, updatePassDto.new_pass)){
                  return {message: "Password has been updated successfully"}
              }
            }else{
              return {message: "Passwords are not matching"}
            }
        }else{
          return {message: "Password is incorrect"}
        }
      }
  }

  public async updatePass(id: string, password: string){
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return await this.userModel.updateOne({_id: id}, {password: hash}).exec();
  }

  public async updateUserImage(id: string, file: Express.Multer.File){
    const user = await this.findById(id);
    if(user){
        if(await this.userModel.updateOne({_id: id}, {image: file.originalname}).exec()){
          return {message: "User Image updated successfully"}
        }
    }else{
      return {message: "User does not exist"}
    }
  }

  public async updateUserDetails(id: string, details: UpdateUserDto){
    const checkEmail = await this.findOne(details.email);
    if(!checkEmail){
      if(await this.userModel.updateOne({_id: id}, {name: details.name, email: details.email, phone: details.phone, address: details.address, city: details.city, state: details.state}).exec()){
        return {message: "User details updated successfully"};
      }
    }else{
      return {message: "Email already exists with another user"}
    }
    
  }

  public async deleteUser(id: string){
    return await this.userModel.deleteOne({_id: id}).exec();
  }
}
