import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { IOrder } from './interface/order.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { UserService } from '../user/user.service';
import { firstValueFrom } from 'rxjs';
import { ProductService } from '../product/product.service';
import * as nodemailer from "nodemailer"
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrderService {
  private transporter: nodemailer.Transporter;
  constructor(@InjectModel("Order") private readonly orderModel: Model<IOrder>, private httpService: HttpService, private userService: UserService, private productService: ProductService, private configService: ConfigService){
    this.transporter = nodemailer.createTransport({
      host: this.configService.get("MAIL_HOST"), // Your SMTP server host
      port: this.configService.get("MAIL_PORT"), // Your SMTP server port
      secure: this.configService.get("MAIL_TCP"), // true for 465, false for other ports
      auth: {
        user: this.configService.get("MAIL_AUTH_USER"), // Your SMTP username
        pass: this.configService.get("MAIL_AUTH_PASS"), // Your SMTP password
      },
    })
  }
  
  public async checkOutOrder(order: CreateOrderDto, id: string) {
    const user = await this.userService.findById(id);
    if(user.cart.length > 0){
        let totalAmount = 0;
        
        order.products = user.cart.filter(async (item) => {
          const product = await this.productService.getProductById(item.productId);
          if (product.quantity >= item.quantity) {
            let rest: number = product.quantity - item.quantity;
            if (await this.productService.updateProductQuantity(item.productId, rest)) {
              return true; // Keep the item in the cart
            }
          } else {
            return false; // Remove the item from the cart by returning false
          }
        });
        order.products.forEach((item) => {
          totalAmount += item.total;
        });
        order.user_id = user._id;
        order.userEmail = user.email;
        order.total = totalAmount;
        if(order.delivery){
          totalAmount += 2500
        }
        const params = {
          email: user.email,
          amount: totalAmount + "00",
        };
    
        const options = {
          headers: {
            Authorization: this.configService.get("PAYSTACK_SECRET"),
            'Content-Type': 'application/json',
          },
        };
    
        try {
          const response = await firstValueFrom(this.httpService.post(
            'https://api.paystack.co/transaction/initialize',
            params,
            options,
          ))
            if(response.data.status){
              order.reference = response.data.data.reference;
              const newOrder = await new this.orderModel(order);
              if(await newOrder.save()){
                if(await this.userService.updateCart(id, [])){
                  return {message: "Cart has been emptied. Order made successfully", response: response.data.data, status: true};
                }
              }
            }else{
              return {message: "Payment initialization not successfully", status: false}
            }
        } catch (error) {
          console.error(error);
          throw error;
        }
    }else{
      return {message: "Cart is empty"};
    }
    
  }

  public async verifyOrder(reference: string) {
    const order = await this.getOrderByReference(reference);
    if(order){
      const options = {
        headers: {
          Authorization: this.configService.get("PAYSTACK_SECRET"),
        },
      };
      try {
        const response = await firstValueFrom(this.httpService.get(`https://api.paystack.co/transaction/verify/${reference}`,options));
        if (response.data.status && response.data.data.status == "success") {
          if (await this.updateOrderByRef(reference)) {
            delete order.paymentStatus;
            if(await this.transporter.sendMail({from: 'amuoladipupo420@gmail.com', to: order.userEmail, subject: "Order payment successful", text: "Your order has been received." + order})){
              return { message: "Order has been verified successfully" };
            }
          }
        } else {
          return { message: "Order verification failed" };
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    }else{
      return {message: "Order does not exist"}
    }
    
  }

  public async getOrderById(id: string) {
    const order = await this.orderModel.findOne({_id: id}).exec();
    return order;
  }

  public async getOrderByReference(reference: string) {
    const order = await this.orderModel.findOne({reference: reference}).exec();
    return order;
  }

  public async getOrdersByUser(user_id: string){
    const order = await this.orderModel.find({user_id: user_id}).exec();
    return order;
  }

  public async getOrders(){
    const order = await this.orderModel.find().exec();
    return order;
  }

  public async getOrdersByStatus(user_id: string, status: "pending" | "completed" | "delivered" | "failed"){
    const order = await this.orderModel.find({$and: [{user_id: {$eq: user_id}}, {paymentStatus: {$eq: status}}]}).exec();
    return order;
  }

  public async updateOrderByRef(reference: string) {
    return await this.orderModel.updateOne({reference: reference}, {paymentStatus: "completed"}).exec();
  }


  public async deleteOrderById(id: string) {
    if(await this.orderModel.deleteOne({_id: id}).exec()){
      return {message: "Order deleted successfully"};
    }
  }

  public async deleteOrderByReference(reference: string) {
    if(await this.orderModel.deleteOne({reference: reference}).exec()){
      return {message: "Order deleted successfully"};
    }
  }

  public async getCurrentCompletedOrders(){
    const today_set = new Date();
    today_set.setHours(23,59,59,999);
    const timestamp_set = today_set.getTime();
    const today_dawn = new Date();
    today_dawn.setHours(0,0,0,0);
    const timestamp_dawn = today_dawn.getTime();
    const completed_orders = await this.orderModel.find({$and: [{paymentStatus: {$eq: "completed"}}, {$and: [{updatedAt: {$gte: today_dawn}}, {updatedAt: {$lte: today_set}}]}]}).exec();
    return completed_orders
  }
}
