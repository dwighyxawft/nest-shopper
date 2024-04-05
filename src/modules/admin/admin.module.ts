import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from './schema/admin.schema';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [MongooseModule.forFeature([{
    name: "Admin",
    schema: AdminSchema
  }])],
  exports: [AdminService]
})
export class AdminModule {}
