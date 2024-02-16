import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schema/order.schema';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [
    MongooseModule.forFeature([
      {
        name: "Order",
        schema: OrderSchema
      }
    ]), HttpModule, UserModule, ProductModule, ConfigModule
  ]
})
export class OrderModule {}
