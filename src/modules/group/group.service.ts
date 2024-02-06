import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { IGroup } from './interface/group.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {

  constructor(@InjectModel("Group") private readonly groupModel: Model<IGroup>){}
  public async createGroup(group: CreateGroupDto){
    const newGroup = await new this.groupModel(group);
    if(await newGroup.save()){
        return {message: "Group added successfully"}
    }
  }

  public async getGroups(){
      try{
          const group = await this.groupModel.find().exec();
          return group;
      }catch(err){
          throw new HttpException({
              status: HttpStatus.SERVICE_UNAVAILABLE,
              error: 'Server Error, Please try again',
          }, HttpStatus.FORBIDDEN, {
              cause: err
          });
      }
  }

  public async getGroupById(id: string){
      try{
          const group = await this.groupModel.find({_id: id}).exec();
          return group;
      }catch(err){
          throw new HttpException({
          status: HttpStatus.SERVICE_UNAVAILABLE,
          error: 'Server Error, Please try again',
          }, HttpStatus.FORBIDDEN, {
          cause: err
          });
      }
  }

  public async deleteGroup(id: string){
      try{
          return await this.groupModel.deleteOne({_id: id}).exec();
      }catch(err){
          throw new HttpException({
          status: HttpStatus.SERVICE_UNAVAILABLE,
          error: 'Server Error, Please try again',
          }, HttpStatus.FORBIDDEN, {
          cause: err
          });
      }
  }

  public async updateGroup(id: string, group: UpdateGroupDto){
      if(await this.groupModel.updateOne({_id: id}, {group})){
          return {message: "Group updated successfully"}
      }
  }
}
