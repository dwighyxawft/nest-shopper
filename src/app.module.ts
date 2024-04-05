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
import { AdminModule } from './modules/admin/admin.module';
import { CourierModule } from './modules/courier/courier.module';
import { LocationsModule } from './modules/locations/locations.module';
import { CheckAuthMiddleware } from './middlewares/checkAuth.middleware';

@Module({
  imports: [UserModule, MongooseConfigModule, AuthModule, CartModule, ProductModule, MulterModule.register({dest: "./uploads"}), CategoryModule, GroupModule, OrderModule, ComplaintModule, MongooseModule.forFeature([{name: "Pass", schema: PassSchema}]), AdminModule, CourierModule, LocationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({path: "cart/*", method: RequestMethod.ALL}, {path: "order/*", method: RequestMethod.ALL}, {path: "product/*", method: RequestMethod.ALL}, {path: "category/*", method: RequestMethod.ALL}, {path: "group/*", method: RequestMethod.ALL}, {path: "complaint/*", method: RequestMethod.ALL}, {path: "admin/*", method: RequestMethod.ALL}, {path: "user/image", method: RequestMethod.PATCH}, {path: "user/password", method: RequestMethod.PATCH}, {path: "user/details", method: RequestMethod.PATCH}, {path: "user/:id", method: RequestMethod.DELETE}, {path: "shop/*", method: RequestMethod.GET})
    .apply(CheckAuthMiddleware).forRoutes({path: "/", method: RequestMethod.GET}, {path: "/auth", method: RequestMethod.GET}, {path: "/register", method: RequestMethod.GET}, {path: "/forgot/password", method: RequestMethod.GET}, {path: "/access/auth", method: RequestMethod.GET})
  }
}




