import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { MongooseConfigModule } from './config/mongoose.config';
import { AuthModule } from './modules/auth/auth.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { CartModule } from './modules/cart/cart.module';
import { ProductModule } from './modules/product/product.module';
import { MulterModule } from '@nestjs/platform-express';
import { CategoryModule } from './modules/category/category.module';
import { GroupModule } from './modules/group/group.module';
import { OrderModule } from './modules/order/order.module';
import { ComplaintModule } from './modules/complaint/complaint.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PassSchema } from './schema/password.schema';

@Module({
  imports: [UserModule, MongooseConfigModule, AuthModule, CartModule, ProductModule, MulterModule.register({dest: "./uploads"}), CategoryModule, GroupModule, OrderModule, ComplaintModule, MongooseModule.forFeature([{name: "Pass", schema: PassSchema}])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({path: "cart/*", method: RequestMethod.ALL}, {path: "order/*", method: RequestMethod.ALL}, {path: "product/*", method: RequestMethod.ALL}, {path: "category/*", method: RequestMethod.ALL}, {path: "group/*", method: RequestMethod.ALL}, {path: "complaint/*", method: RequestMethod.ALL}, {path: "user/image", method: RequestMethod.PATCH}, {path: "user/password", method: RequestMethod.PATCH}, {path: "user/details", method: RequestMethod.PATCH}, {path: "user/:id", method: RequestMethod.DELETE});
  }
}




