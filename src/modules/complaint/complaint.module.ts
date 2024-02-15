import { Module } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { ComplaintController } from './complaint.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ComplaintSchema } from './schema/complaint.schema';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ComplaintController],
  providers: [ComplaintService],
  imports: [
    MongooseModule.forFeature([
      {
        name: "Complaint",
        schema: ComplaintSchema
      }
    ]), UserModule, ConfigModule
  ]
})
export class ComplaintModule {}
