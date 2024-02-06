import { Controller, Get, Post, Patch, Delete, Req, Body, Param } from '@nestjs/common';
import { CartService } from "./cart.service"
import { Request } from 'express';
import { AddToCartDto } from './createCart.dto';

@Controller('cart')
export class CartController {
    constructor(private cartService: CartService){}

    @Get()
    public async getItemsFromCart(@Req() req: Request){
        return this.cartService.getItemsFromCart(req.user["sub"]);
    }

    @Post("create")
    public async addToCart(@Req() req: Request, @Body() cart: AddToCartDto){
        return this.cartService.addToCart(req.user["sub"], cart);
    }

    @Delete("delete/:index")
    public async deleteCartItem(@Req() req: Request, @Param() index){
        return this.cartService.deleteCartItem(req.user["sub"], index);
    }
}
