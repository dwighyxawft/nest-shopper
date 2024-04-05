import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import IAdmin from './interface/admin.interface';
import * as bcrypt from "bcryptjs";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './schema/admin.schema';
import { UpdateAdminPassDto } from './dto/update-password.dto';

@Injectable()
export class AdminService {
  constructor(@InjectModel("Admin") private readonly adminModel: Model<IAdmin>){}
  public async create(adminDetails: CreateAdminDto) {
    
    const existingAdmin = await this.findOne(adminDetails.email);
      if(!existingAdmin){
        adminDetails.image = adminDetails.gender == "male" ? "man.jpeg" : "woman.jpeg";
        if(adminDetails.password === adminDetails.confirm){
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(adminDetails.password, salt);
            adminDetails.password = hash;
            const newadmin = new this.adminModel(adminDetails);
            if(await newadmin.save()){
                return {message: "Admin registration successful.", status: true}
            }
        }else{
          return {message: "Passwords are not matching"}
        }
      }else{
        return {message: "Admin already exists"};
      }
      
  
  }

  public async findAll(id: string): Promise<Admin[] | undefined> {
    return await this.adminModel.find({_id: {$ne: id}}).exec();
  }

  public async findOne(email: string): Promise<Admin | undefined> {
      const admin = await this.adminModel.findOne({email: email}).exec();
      return admin;
  }

  public async findById(id: string): Promise<Admin | undefined> {
    const admin = await this.adminModel.findOne({_id: id}).exec();
    return admin;
}

  public async update(id: string, details: UpdateAdminDto) {
      if(await this.adminModel.updateOne({_id: id}, details).exec()){
        return {message: "Admin details updated successfully"};
      }
  }

  public async password(id: string, details: UpdateAdminPassDto){
    const admin = await this.findById(id);
    if(admin){
      if(details.new_pass == details.confirm){
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(details.confirm, 10);
        if(await this.adminModel.updateOne({_id: id}, {password: hash}).exec()){
          return {message: "Admin password updated successfully"};
        }
      }
    }else{
      return {message: "Admin does not exist"}
    }
  }

  public async remove(id: string) {
    if(await this.adminModel.deleteOne({_id: id}).exec()){
      return {status: true, message: "Admin deleted successfully"}
    }
  }
}
