import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CustomRequest } from 'src/interface/custom.interface';
import { UpdateAdminPassDto } from './dto/update-password.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post("create")
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  findAll(@Req() req: CustomRequest) {
    return this.adminService.findAll(req.admin["sub"]);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.adminService.findById(id);
  }

  @Get('')
  findOne(@Query('email') email: string) {
    return this.adminService.findOne(email);
  }

  @Patch('password/:id')
  password(@Body() updateAdminDto: UpdateAdminPassDto, @Param("id") id: string) {
    return this.adminService.password(id, updateAdminDto);
  }

  @Patch(':id')
  update(@Body() updateAdminDto: UpdateAdminDto, @Param("id") id: string) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
