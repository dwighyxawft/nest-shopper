import { Body, Controller, Get, Post, Render, Res, Param, Req, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render("index")
  getHello(): {message: string} {
    return this.appService.getHello();
  }

  

  @Get("register")
  @Render("register")
  register(): {message: string} {
    return this.appService.register();
  }

  @Get("forgot/password")
  @Render("forgot")
  forgot(): {message: string} {
    return this.appService.forgot();
  }

  @Get("reset/password/:id/:uuid")
  @Render("reset")
  password(@Param("uuid") uuid: string, @Param("id") id: string, @Res({passthrough: true}) res: Response) {
    return this.appService.password(uuid, id, res)
  }

  @Get("/password/reset/:uuid/:id")
  reset(@Param("uuid") uuid: string, @Param("id") id: string, @Res({passthrough: true}) res: Response): Promise<any>{
    return this.appService.renderPasswordPage(uuid, id, res);
  }

  @Post("reset/password")
  public async resetPassword(@Body() body: {email: string}){
    return this.appService.resetPassword(body.email);
  }

  @Post("password/reset")
  public async PasswordReset(@Body() body: {new_pass: string, confirm_pass, id: string, uuid: string}){
    return this.appService.passwordReset(body);
  }

  @Post("mail")
  public async sendMail(@Body() body: {email: string, body: string, subject: string}){
    return this.appService.sendMail(body.email, body.body, body.subject);
  }






  // Authenticated user pages
  @Get("/shop/home")
    renderHomePage(@Req() req: Request, @Res({passthrough: true}) res: Response){
      if(req.query.get){
        const get = req.query.get;
        return this.appService.renderHomePage(req.user["sub"], +get, res);
      }
      else return this.appService.renderHomePage(req.user["sub"], 0, res)
    }

    @Get("/shop/product/:id")
    renderProductPage(@Req() req: Request, @Param("id") id: string, @Res({passthrough: true}) res: Response){
      return this.appService.renderProductPage(req.user["sub"], id, res)
    }

    @Get("/shop/cart/")
    renderCartPage(@Req() req: Request, @Res({passthrough: true}) res: Response){
      return this.appService.renderCartPage(req.user["sub"], res)
    }
    @Get("/shop/group")
    renderGroupPage(@Req() req: Request, @Res({passthrough: true}) res: Response){
      if(req.query.group){
        if(req.query.get){
          const get = req.query.get;
          return this.appService.renderGroupPage(req.user["sub"], res, String(req.query.group), +get)
        }else{
          console.log(String(req.query.group))
          return this.appService.renderGroupPage(req.user["sub"], res, String(req.query.group), 0)
        }
      }else{
        if(req.query.get){
          const get = req.query.get;
          return this.appService.renderGroupPage(req.user["sub"], res, null, +get)
        }else{
          return this.appService.renderGroupPage(req.user["sub"], res, null, 0)
        }
      }
    }

    @Get("/shop/category")
    renderCategoryPage(@Req() req: Request, @Res({passthrough: true}) res: Response){
      if(req.query.category){
        if(req.query.get){
          const get = req.query.get;
          return this.appService.renderCategoryPage(req.user["sub"], res, String(req.query.category), +get)
        }else{
          return this.appService.renderCategoryPage(req.user["sub"], res, String(req.query.category), 0)
        }
      }else{
        if(req.query.get){
          const get = req.query.get;
          return this.appService.renderCategoryPage(req.user["sub"], res, null, +get)
        }else{
          return this.appService.renderCategoryPage(req.user["sub"], res, null, 0)
        }
      }
    }

    @Get("/shop/order")
    renderOrderPage(@Req() req: Request, @Res({passthrough: true}) res: Response){
        if(req.query.status && (req.query.status == "pending" || req.query.status == "completed" || req.query.status == "failed" || req.query.status == "delivered")){
          return this.appService.renderOrderPage(req.user["sub"], res, req.query.status)
        }else{
          return this.appService.renderOrderPage(req.user["sub"], res, null)
        }
    }

    @Get("/shop/order/:id")
    renderDetailsPage(@Req() req: Request, @Res({passthrough: true}) res: Response, @Param("id") id: string){
        return this.appService.renderDetailPage(req.user["sub"], id, res);
    }

    @Get("/shop/settings/")
    renderSettingsPage(@Req() req: Request, @Res({passthrough: true}) res: Response){
        return this.appService.renderSettingsPage(req.user["sub"], res);
    }

    @Get("/shop/contact")
    @Render("contact")
    contact(): {message: string} {
      return this.appService.contact();
    }
}
