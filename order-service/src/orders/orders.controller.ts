import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() body: { amount: number; userPhone: string }) {
    return this.ordersService.createOrder(body.amount, body.userPhone);
  }
}