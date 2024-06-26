import { Controller ,Get, Post, Patch, Delete, Body, Param, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UseInterceptors, UploadedFiles } from '@nestjs/common';
import { multerConfig } from 'src/config/multer.config';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from "sharp";
import { createReadStream } from 'fs';

@ApiTags("Product")
@Controller('product')
export class ProductController {
    constructor(private productService: ProductService){}

    


    @Post("/create")
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
    ], multerConfig))
    public async addProducts(@UploadedFiles() files: { image1: Express.Multer.File, image2: Express.Multer.File, image3: Express.Multer.File }, @Body() product: CreateProductDto) {
        return this.productService.createProduct(product, files)
    }

    @Patch("/update/:id")
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
    ], multerConfig))
    public async updateProduct(@Param("id") id: string, @UploadedFiles() files: { image1: Express.Multer.File, image2: Express.Multer.File, image3: Express.Multer.File }, @Body() product: UpdateProductDto) {
        return this.productService.updateProduct(id, product, files)
    }

    @Delete("/:id")
    public async deleteProduct(@Param() id: string) {
        return this.productService.deleteProductById(id)
    }

    @Get("/:id")
    public async getProductById(@Param() id: string) {
        return this.productService.getProductById(id)
    }

    @Get("")
    public async getProducts() {
        return this.productService.getProducts()
    }

    @Get("low/stock")
    public async lowStocks() {
        return this.productService.lowStockedProducts()
    }

    
}
