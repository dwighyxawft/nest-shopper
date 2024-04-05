import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/modules/auth/auth.service';
import { CustomRequest } from 'src/interface/custom.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    // Extract the access_token from the cookie
    const accessToken = req.cookies['access_token'];

    if (accessToken || accessToken != null) {
      try {
        // Verify the access_token
        const decodedToken = await this.jwtService.verify(accessToken);
        // Attach user details to the request object
        req.user = decodedToken;
        req.admin = decodedToken;
        req.courier = decodedToken;
        // Continue with the request processing
        next();
      } catch (error) {
        // Handle token verification failure (e.g., expired token)
        await this.authService.deleteToken(accessToken);
        res.redirect('/auth');
      }
    } else {
      // No access_token found in the cookie
      res.redirect('/auth');
    }
  }
}
