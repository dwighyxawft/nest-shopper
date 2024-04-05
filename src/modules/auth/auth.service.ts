import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import IAuth from './interfaces/auth.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { AdminService } from '../admin/admin.service';
import { CourierService } from '../courier/courier.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private adminService: AdminService,
    private courierService: CourierService,
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
          const newAuth = await new this.authModel({
            user_id: user._id,
            admin_id: "null",
            courier_id: "null",
            access_token: access_token,
          });
          if (await newAuth.save()) {
            res.cookie('access_token', access_token, { httpOnly: true });
            return { status: true };
          }
        } else {
          if (await this.updateToken(user._id, access_token)) {
            res.cookie('access_token', access_token, { httpOnly: true });
            return { status: true };
          }
        }
      } else {
        return { message: 'Password is not correct', status: false };
      }
    } else {
      return { message: 'User does not exist', status: false };
    }
  }

  public async adminToken(
    email: string,
    password: string,
    res: Response,
  ): Promise<any> {
    const admin = await this.adminService.findOne(email);
    if (admin) {
      if (await bcrypt.compare(password, admin.password)) {
        const payload = { sub: admin._id, name: admin.name };
        const access_token = await this.jwtService.signAsync(payload);
        const auth = await this.getAdmin(admin._id);
        if (!auth) {
          const newAuth = await new this.authModel({
            admin_id: admin._id,
            user_id: "null",
            courier_id: "null",
            access_token: access_token,
          });
          if (await newAuth.save()) {
            res.cookie('access_token', access_token, { httpOnly: true });
            return { status: true };
          }
        } else {
          if (await this.updateAdmin(admin._id, access_token)) {
            res.cookie('access_token', access_token, { httpOnly: true });
            return { status: true };
          }
        }
      } else {
        return { message: 'Password is not correct', status: false };
      }
    } else {
      return { message: 'Admin does not exist', status: false };
    }
  }

  public async courierToken(
    email: string,
    password: string,
    res: Response,
  ): Promise<any> {
    const courier = await this.courierService.findOne(email);
    if (courier) {
      if (await bcrypt.compare(password, courier.password)) {
        const payload = { sub: courier._id, name: courier.name };
        const access_token = await this.jwtService.signAsync(payload);
        const auth = await this.getCourier(courier._id);
        if (!auth) {
          const newAuth = await new this.authModel({
            admin_id: "null",
            user_id: "null",
            courier_id: courier._id,
            access_token: access_token,
          });
          if (await newAuth.save()) {
            res.cookie('access_token', access_token, { httpOnly: true });
            return { status: true };
          }
        } else {
          if (await this.updateCourier(courier._id, access_token)) {
            res.cookie('access_token', access_token, { httpOnly: true });
            return { status: true };
          }
        }
      } else {
        return { message: 'Password is not correct', status: false };
      }
    } else {
      return { message: 'Admin does not exist', status: false };
    }
  }


  login(): {message: string} {
    return {message: "Login"};
  }

  public async deleteToken(token) {
    return await this.authModel.deleteOne({ access_token: token }).exec();
  }

  public async getToken(id) {
    const auth = await this.authModel.findOne({ user_id: id }).exec();
    return auth;
  }

  public async getAdmin(id) {
    const auth = await this.authModel.findOne({ admin_id: id }).exec();
    return auth;
  }

  public async getCourier(id) {
    const auth = await this.authModel.findOne({ courier_id: id }).exec();
    return auth;
  }

  public async getAccess(access) {
    const auth = await this.authModel.findOne({ access_token: access }).exec();
    return auth;
  }

  public async updateToken(id, token) {
    return await this.authModel
      .updateOne({ user_id: id }, { access_token: token })
      .exec();
  }

  public async updateAdmin(id, token) {
    return await this.authModel
      .updateOne({ admin_id: id }, { access_token: token })
      .exec();
  }

  public async updateCourier(id, token) {
    return await this.authModel
      .updateOne({ courier_id: id }, { access_token: token })
      .exec();
  }
}
