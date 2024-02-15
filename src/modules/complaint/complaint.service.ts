import { Injectable } from '@nestjs/common';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { IComplaint } from './interface/complaint.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import * as nodemailer from "nodemailer";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ComplaintService {
  private transporter: nodemailer.Transporter;
  constructor(@InjectModel("Complaint") private readonly complaintModel: Model<IComplaint>, private userService: UserService, private configService: ConfigService){
    this.transporter = nodemailer.createTransport({
      host: this.configService.get("MAIL_HOST"), // Your SMTP server host
      port: this.configService.get("MAIL_PORT"), // Your SMTP server port
      secure: this.configService.get("MAIL_TCP"), // true for 465, false for other ports
      auth: {
        user: this.configService.get("MAIL_AUTH_USER"), // Your SMTP username
        pass: this.configService.get("MAIL_AUTH_PASS"), // Your SMTP password
      },
    })
  }

  public async create(complaint: CreateComplaintDto) {
    const user = await this.userService.findOne(complaint.email);
    if(user){
      complaint.name = user.name;
      if(await this.transporter.sendMail({from: 'amuoladipupo420@gmail.com', to: complaint.email, subject: complaint.subject, text: "Your message has been received. Our team is working on it and will be get back to you shortly"})){
        const newComplaint = await new this.complaintModel(complaint);
        if(await newComplaint.save()){
            return {message: 'complaint has been made'}
        }
      }
    }else{
      return {message: "user does not exist "}
    }
  }

  public async getAllComplaints() {
    return await this.complaintModel.find().exec();
  }

  public async getComplaintById(id: string) {
    return await this.complaintModel.findOne({_id: id}).exec();
  }

  public async getComplaintByEmail(email: string) {
    return await this.complaintModel.findOne({email: email}).exec();
  }

  public async deleteComplaint(id: string) {
    return await this.complaintModel.deleteOne({_id: id}).exec();
  }

  public async deleteComplaintsByEmail(email: string){
    return await this.complaintModel.deleteMany({email: email}).exec();
  }
}
