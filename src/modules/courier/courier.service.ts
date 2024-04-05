import { Injectable } from '@nestjs/common';
import { CreateCourierDto } from './dto/create-courier.dto';
import { UpdateCourierDto } from './dto/update-courier.dto';
import * as bcrypt from "bcryptjs";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Courier } from './schema/courier.schema';
import { UpdateCourierPassDto } from './dto/update-password.dto';

@Injectable()
export class CourierService {
  constructor(@InjectModel("Courier") private readonly courierModel: Model<Courier>){}
  public async create(courierDetails: CreateCourierDto) {
    
    const existingCourier = await this.findOne(courierDetails.email);
      if(!existingCourier){
        courierDetails.image = courierDetails.gender == "male" ? "man.jpeg" : "woman.jpeg";
        if(courierDetails.password === courierDetails.confirm){
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(courierDetails.password, salt);
            courierDetails.password = hash;
            const newCourier = new this.courierModel(courierDetails);
            if(await newCourier.save()){
                return {message: "Courier registration successful.", status: true}
            }
        }else{
          return {message: "Passwords are not matching"}
        }
      }else{
        return {message: "Courier already exists"};
      }
      
  
  }

  public async findAll(id: string): Promise<Courier[] | undefined> {
    return await this.courierModel.find({_id: {$ne: id}}).exec();
  }

  public async getAll(): Promise<Courier[] | undefined>{
    return await this.courierModel.find().exec();
  }

  public async findOne(email: string): Promise<Courier | undefined> {
      const courier = await this.courierModel.findOne({email: email}).exec();
      return courier;
  }

  public async findById(id: string): Promise<Courier | undefined> {
    const courier = await this.courierModel.findOne({_id: id}).exec();
    return courier;
}

  public async update(id: string, details: UpdateCourierDto) {
      if(await this.courierModel.updateOne({_id: id}, details).exec()){
        return {message: "Courier details updated successfully"};
      }
  }

  public async password(id: string, details: UpdateCourierPassDto){
    const Courier = await this.findById(id);
    if(Courier){
      if(details.new_pass == details.confirm){
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(details.confirm, 10);
        if(await this.courierModel.updateOne({_id: id}, {password: hash}).exec()){
          return {message: "Courier password updated successfully"};
        }
      }
    }else{
      return {message: "Courier does not exist"}
    }
  }

  public async remove(id: string) {
    if(await this.courierModel.deleteOne({_id: id}).exec()){
      return {status: true, message: "Courier deleted successfully"}
    }
  }
}
