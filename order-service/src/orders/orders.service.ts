import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    @Inject('PAYMENT_SERVICE') private client: ClientProxy,
  ) {}

  async createOrder(amount: number, userPhone: string) {
    // 1. Bazaga saqlaymiz
    const order = await this.prisma.order.create({
      data: {
        amount,
        userPhone,
        status: 'PENDING',
      },
    });

    // 2. RabbitMQ-ga xabar yuboramiz
    this.client.emit('order_created', order);

    return order;
  }
}