import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Group")
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post("create")
    public async createGroup(@Body() group: CreateGroupDto){
        return this.groupService.createGroup(group);
    }

    @Patch(":id")
    public async updateGroup(@Param("id") id: string ,@Body() group: UpdateGroupDto){
        return this.groupService.updateGroup(id, group);
    }

    @Get("/:id")
    public async getGroupById(@Param() id: string ){
        return this.groupService.getGroupById(id);
    }

    @Get("")
    public async getGroups(){
        return this.groupService.getGroups();
    }

    @Delete("delete/:id")
    public async deleteGroup(@Param() id: string ){
        return this.groupService.deleteGroup(id);
    }
}
