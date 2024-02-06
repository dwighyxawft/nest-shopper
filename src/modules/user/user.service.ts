import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from "bcryptjs";
import IUser from './interface/user.interface';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel("User") private readonly userModel: Model<IUser>){}
  public async register(userDetails: CreateUserDto) {
    const existingUser = await this.findOne(userDetails.email);
      if(!existingUser){
        userDetails.image = userDetails.gender == "male" ? "male.jpg" : "female.jpg";
        if(userDetails.password === userDetails.confirm){
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(userDetails.password, salt);
            userDetails.password = hash;
            const newUser = new this.userModel(userDetails);
            if(await newUser.save()){
              return {message: "User registration successful."}
            }
        }else{
          return {message: "Passwords are not matching"}
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

  public async updateCart(id: string, cart: any[]) {
    return this.userModel.updateOne({_id: id}, {cart: cart}).exec();
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
