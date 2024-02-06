import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AddToCartDto } from './createCart.dto';
import { ProductService } from '../product/product.service';

@Injectable()
export class CartService {
    constructor(private userService: UserService, private productService: ProductService){}

    public async getItemsFromCart(id: string){
        const user = await this.userService.findById(id);
        if(user){
            return {carts: user.cart};
        }
    }

    public async addToCart(id: string, cart: AddToCartDto){
        const user = await this.userService.findById(id);
        if(user){
            const product = await this.productService.getProductById(cart.productId);
            if(product){
                const checkProduct = user.cart.find((item) => item.productId === cart.productId);
                if(!checkProduct){
                    cart.price = product.price;
                    cart.total = cart.price * cart.quantity;
                    user.cart.push(cart);
                    if(product.quantity >= cart.quantity){
                        if(await this.userService.updateCart(id, user.cart)){
                            return {message: "Cart has been updated", cart: user.cart};
                        }
                    }else{
                        return {message: "Product quantity not enough"}
                    }
                }else{
                    return {message: "The product is already in your cart", cart: user.cart};
                }
            }else{
                return {message: "This product does not exist"};
            }
            
        }
    }

    public async deleteCartItem(id: string, index: number){
        const user = await this.userService.findById(id);
        if(user){
            if(user.cart.length > 0){
                user.cart.splice(index, 1);
                if(await this.userService.updateCart(id, user.cart)){
                    return {message: "Cart item has been removed", cart: user.cart};
                }
            }else{
                return {message: "Cart is empty."}
            }
        }
    }
}
