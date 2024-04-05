import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { IProduct } from './interface/product.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { CategoryService } from '../category/category.service';
import { GroupService } from '../group/group.service';
import { UserService } from '../user/user.service';
import * as fs from "fs";
import { join } from 'path';


@Injectable()
export class ProductService {
    constructor(@InjectModel("Product") private readonly productModel: Model<IProduct>, private categoryService: CategoryService, private groupService: GroupService, private userService: UserService){}

    public async getProducts(){
        try{
            const products = await this.productModel.find().exec();
            return products;
        }catch(err){
          throw new HttpException({
            status: HttpStatus.SERVICE_UNAVAILABLE,
            error: 'Server Error, Please try again',
          }, HttpStatus.FORBIDDEN, {
            cause: err
          });
        }
    }

    public async getProductById(id: string){
        try{
            const product = await this.productModel.findOne({_id: id}).exec();
            return product;
        }catch(err){

          throw new HttpException({
            status: HttpStatus.SERVICE_UNAVAILABLE,
            error: 'Server Error, Please try again' + err,
          }, HttpStatus.FORBIDDEN, {
            cause: err
          });
        }
    }

    public async lowStockedProducts(){
      const low_stocks = await this.productModel.find({quantity: {$lte: 2}}).exec();
      return low_stocks;
    }

    public async deleteProductById(id: string){
        if(await this.productModel.deleteOne({_id: id}).exec()){
          return {status: true};
        }
    }

    public async createProduct(product: CreateProductDto, files: { image1: Express.Multer.File, image2: Express.Multer.File, image3: Express.Multer.File }){
        product.images = [files.image1[0].filename, files.image2[0].filename, files.image3[0].filename];
        product.keywords = product.keyword.split(', ');
        delete product.keyword;
        const newProduct = await new this.productModel(product);
        const category = await this.categoryService.getCategoryById(product.category);
        const group = await this.groupService.getGroupById(product.group);
        if(group && category){
          if(await newProduct.save()){
              return {message: "Product has been added successfully", newProduct};
          }
        }else{
          return {message: "Group or category does not exist"}
        }
        
        
    }

    public async updateProduct(id: string, product: UpdateProductDto, files: { image1: Express.Multer.File, image2: Express.Multer.File, image3: Express.Multer.File }) {
      // Retrieve product details including previous image names
      const details = await this.getProductById(id);
  
      // Construct folder path where product images are stored
      const folderPath = join(__dirname, "..", "..", "..", "public", "images", "products");
      console.log(__dirname);
      console.log(folderPath);
      // Iterate over previous image names
      for (const img of details.images) {
          // Construct file path
          const filePath = join(folderPath, img);
          console.log(filePath);
          console.log(img);
          // Delete the image file
          try {
              if (await fs.existsSync(filePath)) {
                  await fs.unlinkSync(filePath);
              }
          } catch (error) {
              console.error(`Error deleting file: ${error}`);
          }
      }
  
      // Update product images with new filenames
      product.images = [files.image1[0].filename, files.image2[0].filename, files.image3[0].filename];
  
      // Split and assign product keywords
      product.keywords = product.keyword.split(', ');
      delete product.keyword;
  
      // Retrieve category and group details
      const category = await this.categoryService.getCategoryById(product.category);
      const group = await this.groupService.getGroupById(product.group);
  
      // Check if category and group exist
      if (group && category) {
          // Update product details in the database
          if (await this.productModel.updateOne({ _id: id }, product)) {
              return { message: "Product has been updated successfully", product };
          }
      } else {
          return { message: "Group or category does not exist" };
      }
  }
  

    public async updateProductQuantity(id: string, quantity: number){
        return await this.productModel.updateOne({_id: id}, {quantity: quantity})
    }

    public async getRandomProducts(start: number, end: number, condition){
        if(condition != null){
          return await this.productModel.find(condition).sort({createdAt: -1}).skip(start).limit(end).exec();
        }else{
          return await this.productModel.find().sort({createdAt: -1}).skip(start).limit(end).exec();
        }
    }

    public async getProductsByCondition(condition){
      if(condition != null){
        return await this.productModel.find(condition).exec();
      }else{
        return await this.productModel.find().exec();
      }
    }

    
}
