import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICategory } from './interface/category.interface';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Injectable()
export class CategoryService {
    constructor(@InjectModel("Category") private readonly categoryModel: Model<ICategory>){}
     
    public async createCategory(category: CreateCategoryDto){
        const newCategory = await new this.categoryModel(category);
        if(await newCategory.save()){
            return {message: "Category added successfully"}
        }
    }

    public async getCategories(){
        try{
            const category = await this.categoryModel.find().exec();
            return category;
        }catch(err){
            throw new HttpException({
                status: HttpStatus.SERVICE_UNAVAILABLE,
                error: 'Server Error, Please try again',
            }, HttpStatus.FORBIDDEN, {
                cause: err
            });
        }
    }

    public async getCategoryById(id: string){
        try{
            const category = await this.categoryModel.findOne({_id: id}).exec();
            return category;
        }catch(err){
            throw new HttpException({
            status: HttpStatus.SERVICE_UNAVAILABLE,
            error: 'Server Error, Please try again',
            }, HttpStatus.FORBIDDEN, {
            cause: err
            });
        }
    }

    public async deleteCategory(id: string){
        try{
            return await this.categoryModel.deleteOne({_id: id}).exec();
        }catch(err){
            throw new HttpException({
            status: HttpStatus.SERVICE_UNAVAILABLE,
            error: 'Server Error, Please try again',
            }, HttpStatus.FORBIDDEN, {
            cause: err
            });
        }
    }

    public async updateCategory(id, category: UpdateCategoryDto){
        if(await this.categoryModel.updateOne({_id: id}, category).exec()){
            return {message: "Category updated successfully"}
        }
    }
}
