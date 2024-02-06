import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import IAuth from './interfaces/auth.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel('Auth') private readonly authModel: Model<IAuth>,
  ) {}

  public async createToken(
    email: string,
    password: string,
    res: Response,
  ): Promise<any> {
    const user = await this.userService.findOne(email);
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const payload = { sub: user._id, name: user.name };
        const access_token = await this.jwtService.signAsync(payload);
        const auth = await this.getToken(user._id);
        if (!auth) {
          const newAuth = new this.authModel({
            user_id: user._id,
            access_token: access_token,
          });
          if (await newAuth.save()) {
            res.cookie('access_token', access_token, { httpOnly: true });
            return { access_token };
          }
        } else {
          if (await this.updateToken(user._id, access_token)) {
            res.cookie('access_token', access_token, { httpOnly: true });
            return { access_token };
          }
        }
      } else {
        return { message: 'Password is not correct' };
      }
    } else {
      return { message: 'User does not exist' };
    }
  }

  public async deleteToken(token) {
    return await this.authModel.deleteOne({ access_token: token }).exec();
  }

  public async getToken(id) {
    const auth = await this.authModel.findOne({ user_id: id }).exec();
    return auth;
  }

  public async updateToken(id, token) {
    return await this.authModel
      .updateOne({ user_id: id }, { access_token: token })
      .exec();
  }
}
