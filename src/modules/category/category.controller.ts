import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Category")
@Controller('category')
export class CategoryController {

    constructor(private categoryService: CategoryService){}

    @Post("create")
    public async createCategory(@Body() category: CreateCategoryDto){
        return this.categoryService.createCategory(category);
    }

    @Patch(":id")
    public async updateCategory(@Param("id") id: string, @Body() category: UpdateCategoryDto){
        return this.categoryService.updateCategory(id, category);
    }

    @Get("/:id")
    public async getCategoryById(@Param() id: string ){
        return this.categoryService.getCategoryById(id);
    }

    @Get("")
    public async getCategories(){
        return this.categoryService.getCategories();
    }

    @Delete("delete/:id")
    public async deleteCategory(@Param() id: string ){
        return this.categoryService.deleteCategory(id);
    }

}
