import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://dwighyxawft:Cdznr0Eu5AVwfxvl@shopper.4zxuhkq.mongodb.net/'),
  ],
})
export class MongooseConfigModule {}
