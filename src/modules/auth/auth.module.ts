import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { UserModule } from '../user/user.module';
import { AuthSchema } from './schema/auth.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from '../admin/admin.module';
import { CourierModule } from '../courier/courier.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UserModule, JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '1d' },
  }), MongooseModule.forFeature([
    {
      name: "Auth",
      schema: AuthSchema
    }
  ]), AdminModule, CourierModule],
  exports: [AuthService]
})
export class AuthModule {}
