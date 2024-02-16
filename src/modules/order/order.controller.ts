import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Order")
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post("create")
  create(@Body() order: CreateOrderDto, @Req() req: Request ) {
    return this.orderService.checkOutOrder(order, req.user["sub"]);
  }

  @Get()
  public async getOrders() {
    return this.orderService.getOrders();
  }

  @Get('verify')
  public async verifyOrder(@Query('reference') reference: string) {
    return this.orderService.verifyOrder(reference);
  }

  @Get('ref/:reference')
  public async getOrderByRef(@Param('reference') reference: string) {
    return this.orderService.getOrderByReference(reference);
  }

  @Get('user/:id')
  public async getOrdersByUser(@Param('id') id: string) {
    return this.orderService.getOrdersByUser(id);
  }

  @Get('completed')
  public async getCompletedOrders() {
    return this.orderService.getOrdersByStatus("completed");
  }

  @Get('pending')
  public async getPendingOrders() {
    return this.orderService.getOrdersByStatus("pending");
  }

  @Get("current")
  public async getCurrentOrders() {
    return this.orderService.getCurrentCompletedOrders();
  }

  @Get(':id')
  public async getOrderById(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Patch(':reference')
  public async updateOrderByReference(@Param('reference') reference: string) {
    return this.orderService.updateOrderByRef(reference);
  }

  @Delete('ref/:reference')
  public async deleteOrderByReference(@Param('reference') reference: string) {
    return this.orderService.deleteOrderByReference(reference);
  }

  @Delete(':id')
  public async deleteOrderById(@Param('id') id: string) {
    return this.orderService.deleteOrderById(id);
  }


}
