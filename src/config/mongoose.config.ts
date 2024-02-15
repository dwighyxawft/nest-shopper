import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://xawft:timilehin1.@xawftly.wcbaypa.mongodb.net/'),
  ],
})
export class MongooseConfigModule {}
