import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserService } from './modules/user/user.service';
import * as nodemailer from "nodemailer";
import {v4 as uuidv4} from "uuid"
import IPass from './interface/password.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { ProductService } from './modules/product/product.service';
import { GroupService } from './modules/group/group.service';
import { CategoryService } from './modules/category/category.service';
import { OrderService } from './modules/order/order.service';
import { AdminService } from './modules/admin/admin.service';
import { CourierService } from './modules/courier/courier.service';
import { LocationsService } from './modules/locations/locations.service';
import { ComplaintService } from './modules/complaint/complaint.service';
import { AuthService } from './modules/auth/auth.service';
import { CustomRequest } from './interface/custom.interface';

@Injectable()
export class AppService {
  private transporter = nodemailer.Transporter;
  constructor(private userService: UserService, 
    @InjectModel("Pass") private readonly passModel: Model<IPass>, 
    private productService: ProductService,
    private groupService: GroupService,
    private categoryService: CategoryService,
    private orderService: OrderService,
    private adminService: AdminService,
    private courierService: CourierService,
    private locateService: LocationsService,
    private complaintService: ComplaintService,
    private authService: AuthService
    ){
    this.transporter = nodemailer.createTransport({
      host: 'smtp-relay.sendinblue.com', // Your SMTP server host
      port: 587, // Your SMTP server port
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'amuoladipupo@gmail.com', // Your SMTP username
        pass: 'bXfgDO2VMpZGFE19', // Your SMTP password
      },
    })
  }
  getHello(): {message: string} {
    return {message: "Get Started"};
  }

  register(): {message: string} {
    return {message: "Register"};
  }

  public async contact(id: string, res: Response) {
    const user = await this.userService.findById(id);
    if(user){
      return res.render("contact", {message: "Contact Us", user});
    }
  }

  forgot(): {message: string} {
    return {message: "Forgot Password"};
  }

  public async resetPassword(email: string){
    const user = await this.userService.findOne(email);
    const uuid = uuidv4();
    if(user){
      const checkPass = await this.passModel.findOne({user_id: user._id}).exec();
      if(!checkPass){
        const newPass = await new this.passModel({user_id: user._id, uuid: uuid, createdAt: Date.now(), expiry: Date.now() + (1000 * 60 * 60 * 6)});
        if(await newPass.save()){
          if(await this.transporter.sendMail({from: 'amuoladipupo420@gmail.com', to: email, subject: "Reset your password", text: "Reset your password with this link, If link is not clickable, copy the link and paste it in your browser" + "https://shop.onrender.com/password/reset/"+uuid}+"/"+user._id)){
            return {message: "A link has been sent to your email for you to recover your account", status: true}
          }
        }
      }else{
        if(Date.now() <= +checkPass.expiry){
          if(await this.transporter.sendMail({from: 'amuoladipupo420@gmail.com', to: email, subject: "Reset your password", text: "Reset your password with this link, If link is not clickable, copy the link and paste it in your browser" + "https://shop.onrender.com/password/reset/"+checkPass.uuid}+"/"+checkPass.user_id)){
            return {message: "A link has been sent to your email for you to recover your account", status: true}
          }    
        }else{
          if(await this.passModel.updateOne({user_id: user._id}, {uuid: uuid, createdAt: Date.now(), expiry: Date.now() + (1000 * 60 * 60 * 6)}).exec()){
            if(await this.transporter.sendMail({from: 'amuoladipupo420@gmail.com', to: email, subject: "Reset your password", text: "Reset your password with this link, If link is not clickable, copy the link and paste it in your browser" + "https://shop.onrender.com/password/reset/"+uuid}+"/"+user._id)){
              return {message: "A link has been sent to your email for you to recover your account", status: true}
            }        
          }
        }
      }
    }else{
      return {message: "User does not exist", status: false}
    }
  }

  public async renderPasswordPage(uuid: string, user_id: string, res: Response){
    const passer = await this.passModel.findOne({$and: [{user_id: {$eq: user_id}}, {uuid: {$eq: uuid}}]}).exec();
    if(Date.now() <= +passer.expiry){
      res.redirect("/reset/password/"+passer.user_id+"/"+passer.uuid)
    }else{
      res.redirect("/forgot/password")
    }
  }

  public async password(uuid: string, id: string, res: Response){
    const passer = await this.passModel.findOne({$and: [{user_id: {$eq: id}}, {uuid: {$eq: uuid}}]}).exec();
    if(passer){
      return {uuid, id}
    }else{
      res.redirect("/forgot/password");
    }
  }

  public async passwordReset(body){
    if(body.new_pass === body.confirm_pass){
      if(await this.userService.updatePass(body.id, body.new_pass)){
        if(await this.passModel.deleteOne({$and: [{user_id: {$eq: body.id}}, {uuid: {$eq: body.uuid}}]}).exec()){
          return {message: "Your password has been updated. Proceed to login"};
        }
      }
    }
  }

  public async sendMail(email: string, body: string, subject: string){
    if(await this.transporter.sendMail({from: 'amuoladipupo420@gmail.com', to: email, subject: subject, text: body})){
          return {message: "Your mail has been sent to the user"};
      }
  }

  public async renderHomePage(id: string, start: number, res: Response){
    const user = await this.userService.findById(id);
    if(user){
      const products = await this.productService.getRandomProducts(start, 24, null);
      const count = await this.productService.getProducts();
      const links = Math.ceil(count.length /24);
      return res.render("home", {user, products, links});
    }
  }

  public async renderProductPage(user_id: string, id: string, res: Response){
    const user = await this.userService.findById(user_id);
    if(user){
      const product = await this.productService.getProductById(id);
      if(product){
        const category = await this.categoryService.getCategoryById(product.category);
        const group = await this.groupService.getGroupById(product.group);
        const checkProduct = user.cart.find((item) => item.productId === id);
        return res.render("product", {user, product, category, group, checkProduct});
      }else{
        return res.redirect("/shop/home");
      }
    }
  }

  public async renderCartPage(user_id: string, res: Response){
    const user = await this.userService.findById(user_id);
    if(user){
      if(user.cart.length > 0){
        const productsPromises = user.cart.map(async cart => {
          const product = await this.productService.getProductById(cart.productId);
          return product; // Return the product promise
      });
      let total = 0;
      user.cart.forEach(function(items){
        total += items.total;
      })
      
      const products = await Promise.all(productsPromises);
      const cart = user.cart;
      const all = await this.productService.getProducts();
      let start: number;
      let three;
      if(all.length > 3){
        start = Math.floor(Math.random() * (all.length - 3));
        three = await this.productService.getRandomProducts(start, 3, null);
      }else{
        three = all;
      }
      
        return res.render("cart", {user, products, cart, total, three});
      }else{
        return res.redirect("/shop/home");
      }
    }
  }

  public async renderGroupPage(user_id: string, res: Response, id: string, start: number){
    const user = await this.userService.findById(user_id);
    const groups = await this.groupService.getGroups();
    if(user){
      if(id !== null){
        const group = await this.groupService.getGroupById(id);
        if(group){
          const count = await this.productService.getProductsByCondition({group: id});
          const links = Math.ceil(count.length /24);
          const products = await this.productService.getRandomProducts(start, 24, {group: id});
          return res.render("group", {user, groups, products, group, links});
        }
      }else{
        const count = await this.productService.getProducts();
        const links = Math.ceil(count.length /24);
        const products = await this.productService.getRandomProducts(start, 24, null); 
        const group = null;
        return res.render("group", {user, groups, products, group, links});
      }
    }
  }

  public async renderCategoryPage(user_id: string, res: Response, id: string, start: number){
    const user = await this.userService.findById(user_id);
    const categories = await this.categoryService.getCategories();
    if(user){
      if(id != null){
        const category = await this.categoryService.getCategoryById(id);
        if(category){
          const count = await this.productService.getProductsByCondition({category: id});
          const links = Math.ceil(count.length /24);
          const products = await this.productService.getRandomProducts(start, 24, {category: id});
          return res.render("category", {user, categories, products, category, links});
        }
      }else{
        const count = await this.productService.getProducts();
        const links = Math.ceil(count.length /24);
        const category = null;
        const products = await this.productService.getRandomProducts(start, 24, null);
        return res.render("category", {user, categories, products, category, links});
      }
    }
  }

  public async renderOrderPage(user_id: string, res: Response, id: "pending" | "completed" | "delivered" | "failed"){
    const user = await this.userService.findById(user_id);
    if(user){
      if(id != null){
        const orders = await this.orderService.getOrdersByStatus(user_id, id);
        if(orders){
          return res.render("order", {user, orders, id});
        }
      }else{
        const id = null;
        const orders = await this.orderService.getOrdersByUser(user_id)
        return res.render("order", {user, orders, id});
      }
    }
  }

  public async renderDetailPage(id: string, order_id: string, res: Response){
    const user = await this.userService.findById(id);
    if(user){
      const order = await this.orderService.getOrderById(order_id);
      if(order){
        const productsPromises = order.products.map(async item => await this.productService.getProductById(String(item.productId)));
        const productCheck = await Promise.all(productsPromises);
        const products = productCheck.filter(product => product !== null).map(product => product);
        return res.render("details", {user, products, order});
      }else{
        return res.redirect("/shop/order")
      }
      
    }
  }

  public async renderSettingsPage(id: string, res: Response){
    const user = await this.userService.findById(id);
    if(user){
      return res.render("settings", {user});
    }
  }
  
  


  // Admin Pages

  public async renderAccessLoginPage(res: Response){
    return res.render("admin-login")
  }

  public async renderAccessPage(id: string, res: Response){
    const admin = await this.adminService.findById(id);
    const admins = await this.adminService.findAll(id);
    return res.render("admin-access", {admin, admins});
  }

  public async renderAccessCatPage(id: string, res: Response){
    const categories = await this.categoryService.getCategories();
    const admin = await this.adminService.findById(id);
    let counts = {};
    categories.forEach(async (category) =>{
      const id = category._id;
      const products = await this.productService.getProductsByCondition({category: id});
      counts[id.toString()] = products.length;
    })
    return res.render("admin-category", {admin, categories, counts})
  }

  public async renderAccessCreatePage(id: string, res: Response, admin_id){
    const admin = await this.adminService.findById(id);
    if(admin_id != null){
      const access = await this.adminService.findById(admin_id);
      if(access){
        return res.render("create-access", {admin, access});
      }else{
        return res.render("create-access", {admin, access: null});
      }
    }else{
      return res.render("create-access", {admin, access: null});
    }
  }

  public async renderCatCreatePage(id: string, res: Response, category_id){
    const admin = await this.adminService.findById(id);
    if(category_id != null){
      const category = await this.categoryService.getCategoryById(category_id);
      if(category){
        return res.render("create-category", {admin, category});
      }else{
        return res.render("create-category", {admin, category: null});
      }
    }else{
      return res.render("create-category", {admin, category: null});
    }
  }

  public async renderAccessGroupPage(id: string, res: Response){
    const groups = await this.groupService.getGroups();
    const admin = await this.adminService.findById(id);
    let counts = {};
    groups.forEach(async (group) =>{
      const id = group._id;
      const products = await this.productService.getProductsByCondition({group: id});
      counts[id.toString()] = products.length;
    })
    return res.render("admin-group", {admin, groups, counts})
  }

  public async renderGroupCreatePage(id: string, res: Response, group_id){
    const admin = await this.adminService.findById(id);
    if(group_id != null){
      const group = await this.groupService.getGroupById(group_id);
      if(group){
        return res.render("create-group", {admin, group});
      }else{
        return res.render("create-group", {admin, group: null});
      }
    }else{
      return res.render("create-group", {admin, group: null});
    }
  }

  public async renderAccessProductPage(id: string, res: Response, query: string, start: number){
    const admin = await this.adminService.findById(id);
    let counts;
    let products;
    if(query != null){
      if(query != "oos"){
        products = await this.productService.getRandomProducts(start, 24, {category: query});
        counts = await this.productService.getProductsByCondition({category: query});
      }else{
        products = await this.productService.getRandomProducts(start, 24, {quantity: {$lte: 2}});
        counts = await this.productService.getProductsByCondition({quantity: {$lte: 2}});
      }
    }else{
      products = await this.productService.getRandomProducts(start, 24, null);
      counts = await this.productService.getProductsByCondition(null);
    }
    const links = Math.ceil(counts.length/24);
    return res.render("admin-product", {admin, products, links})
  }

  public async renderProductCreatePage(id: string, res: Response, product_id){
    const admin = await this.adminService.findById(id);
    const groups = await this.groupService.getGroups();
    const categories = await this.categoryService.getCategories()
    if(product_id != null){
      const product = await this.productService.getProductById(product_id);
      if(product){
        return res.render("create-product", {admin, product, categories, groups});
      }else{
        return res.render("create-product", {admin, product: null, categories, groups});
      }
    }else{
      return res.render("create-product", {admin, product: null, categories, groups});
    }
  }

  public async renderAccessCourierPage(id: string, res: Response){
    const admin = await this.adminService.findById(id);
    const couriers = await this.courierService.getAll();
    return res.render("admin-courier", {admin, couriers});
  }

  public async renderCourierCreatePage(id: string, res: Response, courier_id){
    const admin = await this.adminService.findById(id);
    if(courier_id != null){
      const courier = await this.adminService.findById(courier_id);
      if(courier){
        return res.render("create-courier", {admin, courier});
      }else{
        return res.render("create-courier", {admin, courier: null});
      }
    }else{
      return res.render("create-courier", {admin, courier: null});
    }
  }

  public async renderAccessLocationPage(id: string, res: Response){
    const admin = await this.adminService.findById(id);
    const locations = await this.locateService.findAll();
    return res.render("admin-location", {admin, locations});
  }

  public async renderLocationCreatePage(id: string, res: Response, location_id){
    const admin = await this.adminService.findById(id);
    if(location_id != null){
      const location = await this.locateService.findOne(location_id);
      if(location){
        return res.render("create-location", {admin, location});
      }else{
        return res.render("create-location", {admin, location: null});
      }
    }else{
      return res.render("create-location", {admin, location: null});
    }
  }

  public async renderAccessOrderPage(id: string, res: Response, query: string, start: number){
    const admin = await this.adminService.findById(id);
    let counts;
    let orders;
    if(query != null){
      if(query != "today"){
        orders = await this.orderService.getRandomOrders(start, 24, {paymentStatus: query});
        counts = await this.orderService.getOrdersByCondition({paymentStatus: query});
      }else{
        orders = await this.orderService.getCurrentOrders(start, 24);
        const today = new Date();
        const today_dawn = today.setHours(0,0,0,0);
        const today_set = today.setHours(23, 59, 59, 999);
        counts = await this.orderService.getOrdersByCondition({$and: [{updatedAt: {$gte: today_dawn}}, {updatedAt: {$lte: today_set}}]});
      }
    }else{
      orders = await this.orderService.getRandomOrders(start, 24, null);
      counts = await this.orderService.getOrdersByCondition(null);
    }
    const links = Math.ceil(counts.length/24);
    return res.render("admin-order", {admin, orders, links})
  }

  public async renderOrderDetailPage(id: string, order_id: string, res: Response){
    const admin = await this.adminService.findById(id);
    if(admin){
      const order = await this.orderService.getOrderById(order_id);
      if(order){
        const productsPromises = order.products.map(async item => await this.productService.getProductById(String(item.productId)));
        const productCheck = await Promise.all(productsPromises);
        const products = productCheck.filter(product => product !== null).map(product => product);
        return res.render("check-order", {admin, products, order});
      }else{
        return res.redirect("/admin/order")
      }
      
    }
  }

  public async renderAccessComplaintPage(id: string, res: Response){
    const admin = await this.adminService.findById(id);
    const complaints = await this.complaintService.getAllComplaints();
    return res.render("admin-complaint", {admin, complaints});
  }

  public async renderComplaintDetailPage(id: string, complaint_id: string, res: Response){
    const admin = await this.adminService.findById(id);
    if(admin){
      const complaint = await this.complaintService.getComplaintById(complaint_id);
      if(complaint){
        return res.render("check-complaint", {admin, complaint});
      }else{
        return res.redirect("/admin/complaint")
      }
      
    }
  }

  public async renderResolvePage(id: string, res: Response){
    const admin = await this.adminService.findById(id);
    if(admin){
      return res.render("admin-resolve", {admin});
    }
  }

  public async renderAccessHomePage(id: string, res: Response){
    const admin = await this.adminService.findById(id);
    if(admin){
      return res.render("admin-home", {admin});
    }
  }

  public async renderAccessSettingsPage(id: string, res: Response){
    const admin = await this.adminService.findById(id);
    if(admin){
      return res.render("admin-settings", {admin});
    }
  }

  public async logout(req: CustomRequest, res: Response){
    const token = req.cookies["access_token"];
    if(await this.authService.deleteToken(token)){
      res.clearCookie("access_token");
      return res.redirect("/shop/home")
    }
  }


  


}
