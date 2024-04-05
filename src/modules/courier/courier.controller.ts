import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { CourierService } from './courier.service';
import { CreateCourierDto } from './dto/create-courier.dto';
import { UpdateCourierDto } from './dto/update-courier.dto';
import { CustomRequest } from 'src/interface/custom.interface';
import { UpdateCourierPassDto } from './dto/update-password.dto';

@Controller('courier')
export class CourierController {
  constructor(private readonly courierService: CourierService) {}

  @Post("create")
  create(@Body() createCourierDto: CreateCourierDto) {
    return this.courierService.create(createCourierDto);
  }

  @Get()
  findAll(@Req() req: CustomRequest) {
    return this.courierService.findAll(req.admin["sub"]);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.courierService.findById(id);
  }

  @Get('')
  findOne(@Query('email') email: string) {
    return this.courierService.findOne(email);
  }

  @Patch('password/:id')
  password(@Body() updateAdminDto: UpdateCourierPassDto, @Param("id") id: string) {
    return this.courierService.password(id, updateAdminDto);
  }

  @Patch(':id')
  update(@Body() updateAdminDto: UpdateCourierDto, @Param("id") id: string) {
    return this.courierService.update(id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courierService.remove(id);
  }
}
