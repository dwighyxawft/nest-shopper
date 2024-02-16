import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { UpdateUserPassDto } from './dto/update-pass.dto';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { profileConfig } from 'src/config/profile.config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("User")
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  create(@Body() userDetails: CreateUserDto) {
    return this.userService.register(userDetails);
  }

  @Get("users")
  findAll() {
    return this.userService.findAll();
  }

  @Get("verify/account/:uuid/")
  public async verifyUser(@Param("uuid") uuid: string){
    return this.userService.verifyAccount(uuid);
  }

  @Patch("image")
  @UseInterceptors(FileInterceptor("file", profileConfig))
  public async updateUserImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request){
    return this.userService.updateUserImage(req.user["sub"], file)
  }

  @Patch("password")
  public async updateUserPass(@Body() updateUserPass: UpdateUserPassDto, @Req() req: Request){
    return this.userService.updateUserPassword(req.user["sub"], updateUserPass)
  }

  @Patch("details")
  public async updateUserDetails(@Body() updateUserDetails: UpdateUserDto, @Req() req: Request){
    return this.userService.updateUserDetails(req.user["sub"], updateUserDetails)
  }

  @Delete(':id')
  public async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }


}
