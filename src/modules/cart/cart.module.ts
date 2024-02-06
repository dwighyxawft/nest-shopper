import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';


@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [UserModule, ProductModule]
})
export class CartModule {}
