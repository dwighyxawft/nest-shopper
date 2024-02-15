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
import { NotoficationsModule } from './modules/notofications/notifications.module';
import { ComplaintModule } from './modules/complaint/complaint.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { PassSchema } from './schema/password.schema';

@Module({
  imports: [UserModule, MongooseConfigModule, AuthModule, CartModule, ProductModule, MulterModule.register({dest: "./uploads"}), CategoryModule, GroupModule, OrderModule, NotoficationsModule, ComplaintModule, EventEmitterModule.forRoot(), MongooseModule.forFeature([{name: "Pass", schema: PassSchema}])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({path: "cart/*", method: RequestMethod.ALL}, {path: "order/*", method: RequestMethod.ALL});
  }
}




