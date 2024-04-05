import { Body, Controller, Get, Post, Render, Res, Param, Req, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { CustomRequest } from './interface/custom.interface';

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
    contact(@Res({passthrough: true}) res: Response, @Req() req: CustomRequest) {
      return this.appService.contact(req.user["sub"], res);
    }


    // Admin Pages

    @Get("/access/auth")
    renderAccessLoginPage(@Res({passthrough: true}) res: Response){
      return this.appService.renderAccessLoginPage(res);
    }

    @Get("/admin/access")
    renderAccessPage(@Req() req: CustomRequest, @Res({passthrough: true}) res: Response){
      return this.appService.renderAccessPage(req.admin["sub"], res);
    }

    @Get("/admin/category")
    renderAccessCatPage(@Req() req: CustomRequest, @Res({passthrough: true}) res: Response){
      return this.appService.renderAccessCatPage(req.admin["sub"], res);
    }

    @Get("/admin/access/create")
    renderAccessCreatePage(@Req() req: CustomRequest, @Res({passthrough: true}) res: Response){
      if(req.query.admin_id){
        return this.appService.renderAccessCreatePage(req.admin["sub"], res, req.query.admin_id);
      }else{
        return this.appService.renderAccessCreatePage(req.admin["sub"], res, null);
      }
    }

    @Get("/admin/category/create")
    renderCatCreatePage(@Req() req: CustomRequest, @Res({passthrough: true}) res: Response){
      if(req.query.category){
        return this.appService.renderCatCreatePage(req.admin["sub"], res, req.query.category);
      }else{
        return this.appService.renderCatCreatePage(req.admin["sub"], res, null);
      }
    }

    @Get("/admin/group")
    renderAccessGroupPage(@Req() req: CustomRequest, @Res({passthrough: true}) res: Response){
      return this.appService.renderAccessGroupPage(req.admin["sub"], res);
    }

    @Get("/admin/group/create")
    renderGroupCreatePage(@Req() req: CustomRequest, @Res({passthrough: true}) res: Response){
      if(req.query.group){
        return this.appService.renderGroupCreatePage(req.admin["sub"], res, req.query.group);
      }else{
        return this.appService.renderGroupCreatePage(req.admin["sub"], res, null);
      }
    }

    @Get("/admin/product/")
    renderAccessProductPage(@Req() req: CustomRequest, @Res({passthrough: true}) res: Response){
      if(req.query.query){
        if(req.query.get){
          return this.appService.renderAccessProductPage(req.admin["sub"], res, req.query.query.toString(), +req.query.get)
        }else{
          return this.appService.renderAccessProductPage(req.admin["sub"], res, req.query.query.toString(), 0)
        }
      }else{
        if(req.query.get){
          return this.appService.renderAccessProductPage(req.admin["sub"], res, null, +req.query.get)
        }else{
          return this.appService.renderAccessProductPage(req.admin["sub"], res, null, 0)
        }
      }
    }

    @Get("/admin/product/create")
    renderProductCreatePage(@Req() req: CustomRequest, @Res({passthrough: true}) res: Response){
      if(req.query.product_id){
        return this.appService.renderProductCreatePage(req.admin["sub"], res, req.query.product_id);
      }else{
        return this.appService.renderProductCreatePage(req.admin["sub"], res, null);
      }
    }

    @Get("/admin/courier")
    renderAccessCourierPage(@Req() req: CustomRequest, @Res({passthrough: true}) res: Response){
      return this.appService.renderAccessCourierPage(req.admin["sub"], res);
    }

    @Get("/admin/courier/create")
    renderCourierCreatePage(@Req() req: CustomRequest, @Res({passthrough: true}) res: Response){
      if(req.query.courier_id){
        return this.appService.renderCourierCreatePage(req.admin["sub"], res, req.query.courier_id);
      }else{
        return this.appService.renderCourierCreatePage(req.admin["sub"], res, null);
      }
    }

    @Get("/admin/location")
    renderAccessLocationPage(@Req() req: CustomRequest, @Res({passthrough: true}) res: Response){
      return this.appService.renderAccessLocationPage(req.admin["sub"], res);
    }

    @Get("/admin/location/create")
    renderLocationCreatePage(@Req() req: CustomRequest, @Res({passthrough: true}) res: Response){
      if(req.query.location_id){
        return this.appService.renderLocationCreatePage(req.admin["sub"], res, req.query.location_id);
      }else{
        return this.appService.renderLocationCreatePage(req.admin["sub"], res, null);
      }
    }

    @Get("/admin/order/")
    renderAccessOrderPage(@Req() req: CustomRequest, @Res({passthrough: true}) res: Response){
      if(req.query.query){
        if(req.query.get){
          return this.appService.renderAccessOrderPage(req.admin["sub"], res, req.query.query.toString(), +req.query.get)
        }else{
          return this.appService.renderAccessOrderPage(req.admin["sub"], res, req.query.query.toString(), 0)
        }
      }else{
        if(req.query.get){
          return this.appService.renderAccessOrderPage(req.admin["sub"], res, null, +req.query.get)
        }else{
          return this.appService.renderAccessOrderPage(req.admin["sub"], res, null, 0)
        }
      }
    }

    @Get("/admin/order/:id")
    renderOrderDetailsPage(@Req() req: CustomRequest, @Res({passthrough: true}) res: Response, @Param("id") id: string){
        return this.appService.renderOrderDetailPage(req.admin["sub"], id, res);
    }

    @Get("/admin/complaint/")
    renderAccessComplaintPage(@Req() req: CustomRequest, @Res({passthrough: true}) res: Response){
        return this.appService.renderAccessComplaintPage(req.admin["sub"], res)
    }

    @Get("/admin/complaint/:id")
    renderComplaintDetailsPage(@Req() req: CustomRequest, @Res({passthrough: true}) res: Response, @Param("id") id: string){
        return this.appService.renderComplaintDetailPage(req.admin["sub"], id, res);
    }

    @Get("/admin/resolve/")
    renderResolvePage(@Req() req: CustomRequest, @Res({passthrough: true}) res: Response){
        return this.appService.renderResolvePage(req.admin["sub"], res)
    }

    @Get("/admin/home/")
    renderAccessHomePage(@Req() req: CustomRequest, @Res({passthrough: true}) res: Response){
        return this.appService.renderAccessHomePage(req.admin["sub"], res)
    }

    @Get("/admin/settings/")
    renderAccessSettingsPage(@Req() req: CustomRequest, @Res({passthrough: true}) res: Response){
        return this.appService.renderAccessSettingsPage(req.admin["sub"], res)
    }


    @Get("/logout")
    logout(@Req() req: CustomRequest, @Res({passthrough: true}) res: Response){
        return this.appService.logout(req, res);
    }


}
