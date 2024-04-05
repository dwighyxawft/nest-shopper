import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/modules/auth/auth.service';
import { CustomRequest } from 'src/interface/custom.interface';

@Injectable()
export class CheckAuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    if(req.cookies['access_token']){
        const auth = await this.authService.getAccess(req.cookies["access_token"]);
        if(auth){
          if(auth.admin_id.length > 0 || auth.admin_id == null){
            res.redirect("/admin/home")
          }else if(auth.user_id.length > 0){
            res.redirect("/shop/home");
          }
        }else{
          res.redirect("/auth");
        }
    }else{
        next();
    }
  }
}
