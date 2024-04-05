import { Module } from '@nestjs/common';
import { CourierService } from './courier.service';
import { CourierController } from './courier.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CourierSchema } from './schema/courier.schema';

@Module({
  controllers: [CourierController],
  providers: [CourierService],
  imports: [MongooseModule.forFeature([
    {
      name: "Courier",
      schema: CourierSchema
    }
  ])],
  exports: [CourierService]
})
export class CourierModule {}
