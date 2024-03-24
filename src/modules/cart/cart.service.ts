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

    public async addQuantity(id: string, product: string){
        const user = await this.userService.findById(id);
        const checkProduct = await this.productService.getProductById(product);
        if(checkProduct){
            const index = user.cart.findIndex((item) => item.productId === product)
            const quantity = user.cart[index].quantity + 1;
            if(checkProduct.quantity >= quantity){
                user.cart[index].quantity += 1;
                if(await this.userService.updateCart(id, user.cart)){
                    return {status: true}
                }
            }else{
                return {status: false, message: "Product is out of stock", failed: false};
            }
        }else{
            if(await this.deleteCartItem(user._id, product)){
                return {message: "Product does not exist", failed: true, status: false};
            }
        }
    }

    public async removeQuantity(id: string, product: string){
        const user = await this.userService.findById(id);
        const checkProduct = await this.productService.getProductById(product);
        if(checkProduct){
            const index = user.cart.findIndex((item) => item.productId === product)
            const quantity = user.cart[index].quantity - 1;
            if(checkProduct.quantity >= quantity){
                user.cart[index].quantity -= 1;
                if(await this.userService.updateCart(id, user.cart)){
                    return {status: true}
                }
            }else{
                return {status: false, message: "Product is out of stock", failed: false};
            }
        }else{
            if(await this.deleteCartItem(user._id, product)){
                return {message: "Product does not exist", status: false, failed: true};
            }
        }
    }

    public async deleteCartItem(id: string, product: string){
        const user = await this.userService.findById(id);
        if(user){
            if(user.cart.length > 0){
                const checkProduct = user.cart.find((item) => item.productId === product);
                if(checkProduct){
                    const index = user.cart.findIndex((item) => item.productId === product)
                    user.cart.splice(index, 1);
                    if(await this.userService.updateCart(id, user.cart)){
                        return {message: "Cart item has been removed", cart: user.cart, status: true};
                    }
                }else{
                    return {message: "Product is not in the cart", status: false}
                }
            }else{
                return {message: "Cart is empty."}
            }
        }
    }
}
