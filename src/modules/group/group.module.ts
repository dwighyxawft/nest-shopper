import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupSchema } from './schema/group.schema';

@Module({
  controllers: [GroupController],
  providers: [GroupService],
  imports: [MongooseModule.forFeature([
    {
      name: "Group",
      schema: GroupSchema
    }
  ])],
  exports: [GroupService]
})
export class GroupModule {}
