import { Controller, Get, Post, Patch, Delete, Req, Body, Param } from '@nestjs/common';
import { CartService } from "./cart.service"
import { Request } from 'express';
import { AddToCartDto } from './createCart.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Cart")
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

    @Patch("add/:id")
    public async addQuantity(@Req() req: Request, @Param("id") product: string){
        return this.cartService.addQuantity(req.user["sub"], product);
    }

    @Patch("remove/:id")
    public async removeQuantity(@Req() req: Request, @Param("id") product: string){
        return this.cartService.removeQuantity(req.user["sub"], product);
    }


    @Delete("delete/:id")
    public async deleteCartItem(@Req() req: Request, @Param("id") product: string){
        return this.cartService.deleteCartItem(req.user["sub"], product);
    }
}
