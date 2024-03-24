import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CheckAuthMiddleware implements NestMiddleware {

  async use(req: Request, res: Response, next: NextFunction) {
    if(req.cookies['access_token']){
        res.redirect('/shop/home');
    }else{
        next();
    }
  }
}
