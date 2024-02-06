import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { IOrder } from './interface/order.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { UserService } from '../user/user.service';
import { firstValueFrom } from 'rxjs';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderService {
  constructor(@InjectModel("Order") private readonly orderModel: Model<IOrder>, private httpService: HttpService, private userService: UserService, private productService: ProductService){}
  
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
        const params = {
          email: user.email,
          amount: totalAmount + "00",
        };
    
        const options = {
          headers: {
            Authorization: 'Bearer sk_live_58af92d67a993c890713ac20e639ec442169b2ec',
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
                  return {message: "Cart has been emptied. Order made successfully", response: response.data.data};
                }
              }
            }else{
              return {message: "Payment initialization not successfully"}
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
          Authorization: 'Bearer sk_live_58af92d67a993c890713ac20e639ec442169b2ec',
        },
      };
      try {
        const response = await firstValueFrom(this.httpService.get(`https://api.paystack.co/transaction/verify/${reference}`,options));
        if (response.data.status && response.data.data.status == "success") {
          if (await this.updateOrderByRef(reference)) {
            return { message: "Order has been verified successfully" };
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

  public async getOrdersByStatus(status: "pending" | "completed"){
    const order = await this.orderModel.find({paymentStatus: status}).exec();
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
}
