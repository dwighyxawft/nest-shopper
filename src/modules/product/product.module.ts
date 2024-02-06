import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schema/product.schema';
import { CategoryModule } from '../category/category.module';
import { GroupModule } from '../group/group.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [MongooseModule.forFeature([
    {
      name: "Product",
      schema: ProductSchema
    }
  ]), GroupModule, CategoryModule],
  exports: [ProductService]
})
export class ProductModule {}
