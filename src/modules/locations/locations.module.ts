import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationSchema } from './schema/location.schema';

@Module({
  controllers: [LocationsController],
  providers: [LocationsService],
  imports: [MongooseModule.forFeature([
    {
      name: "Location",
      schema: LocationSchema
    }
  ])],
  exports: [LocationsService]
})
export class LocationsModule {}
