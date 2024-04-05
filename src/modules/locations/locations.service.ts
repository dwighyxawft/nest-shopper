import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ILocation } from './interface/location.interface';

@Injectable()
export class LocationsService {
  constructor(@InjectModel("Location") private readonly locateModel: Model<ILocation>){}

  public async create(createLocationDto: CreateLocationDto) {
    const cities = createLocationDto.cities.split(", ");
    const newSide = await new this.locateModel({admin_id: createLocationDto.admin_id, state: createLocationDto.state, city: createLocationDto.city, cities: cities});
    if(await newSide.save()){
      return {status: true, message:"Location created successfully"};
    }
  }

  public async findAll() {
    return await this.locateModel.find().exec();
  }
  
  public async findByAdmin(id: string) {
    return await this.locateModel.find({admin_id: id}).exec();
  }

  public async findOne(id: string) {
    return await this.locateModel.findOne({_id: id}).exec();
  }

  public async getStates(state: string){
    return await this.locateModel.find({state: state}).exec();
  }

  public async update(id: string, updateLocationDto: UpdateLocationDto) {
    if(await this.locateModel.updateOne({_id: id}, updateLocationDto).exec()){
      return {status: true, message: "Location updated successfully"};
    }
  }

  public async remove(id: string) {
    if(await this.locateModel.deleteOne({_id: id}).exec()){
      return {message: "Location deleted successfully"};
    }
  }
}
