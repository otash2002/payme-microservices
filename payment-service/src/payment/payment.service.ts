import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async processPayment(orderData: any) {
    const payment = await this.prisma.payment.create({
      data: {
        orderId: orderData.id,
        amount: orderData.amount,
        status: 'PROCESSING'
      }
    });

    // Simulyatsiya: to'lov muvaffaqiyatli
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'SUCCESS' }
    });

    return payment;
  }
}