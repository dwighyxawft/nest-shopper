import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { VerifySchema } from './schema/verification.schema';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([
    {
      name: "User",
      schema: UserSchema
    }, 
    {
      name: "Verification",
      schema: VerifySchema
    }
  ])], 
  exports: [UserService]
})
export class UserModule {}
