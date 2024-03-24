import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schema/product.schema';
import { CategoryModule } from '../category/category.module';
import { GroupModule } from '../group/group.module';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [MongooseModule.forFeature([
    {
      name: "Product",
      schema: ProductSchema
    }
  ]), GroupModule, CategoryModule, UserModule],
  exports: [ProductService]
})
export class ProductModule {}
