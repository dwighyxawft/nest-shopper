import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './schema/category.schema';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [MongooseModule.forFeature([
    {
      name: "Category",
      schema: CategorySchema
    }
  ])],
  exports: [CategoryService]
})
export class CategoryModule {}
