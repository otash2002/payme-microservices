import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  // 1. RabbitMQ orqali buyurtmani bazaga yozish
  async processPayment(orderData: any) {
    const orderId = Number(orderData.id);
    
    const existing = await this.prisma.payment.findFirst({
      where: { orderId: orderId } as any,
    });

    if (existing) return existing;

    return await this.prisma.payment.create({
      data: {
        orderId: orderId,
        amount: orderData.amount,
        status: 'PENDING',
      } as any,
    });
  }

  // 2. Payme: CheckPerformTransaction
  async checkPerformTransaction(params: any, id: number) {
    const orderId = Number(params.account.order_id);
    const payment: any = await this.prisma.payment.findFirst({
      where: { orderId: orderId } as any,
    });

    if (!payment) return this.makeError(id, -31050, 'Order not found');
    if (payment.amount * 100 !== params.amount) return this.makeError(id, -31001, 'Incorrect amount');

    return { jsonrpc: '2.0', id, result: { allow: true } };
  }

  // 3. Payme: CreateTransaction
  async createTransaction(params: any, id: number) {
    const orderId = Number(params.account.order_id);
    const payment: any = await this.prisma.payment.findFirst({
      where: { orderId: orderId } as any,
    });

    if (!payment) return this.makeError(id, -31050, 'Order not found');

    const updated = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymeId: params.id,
        paymeTime: BigInt(params.time),
        state: 1,
      } as any,
    });

    return {
      jsonrpc: '2.0',
      id,
      result: {
        create_time: Number(updated.paymeTime),
        transaction: updated.paymeId,
        state: 1,
      },
    };
  }

  // 4. Payme: PerformTransaction
  async performTransaction(params: any, id: number) {
    const payment: any = await this.prisma.payment.findFirst({
      where: { paymeId: params.id } as any,
    });

    if (!payment) return this.makeError(id, -31003, 'Transaction not found');

    const updated = await this.prisma.payment.update({
      where: { id: payment.id },
      data: { state: 2, status: 'SUCCESS' } as any,
    });

    return {
      jsonrpc: '2.0',
      id,
      result: { transaction: updated.paymeId, perform_time: Date.now(), state: 2 },
    };
  }

  private makeError(id: number, code: number, msg: string) {
    return {
      jsonrpc: '2.0',
      id,
      error: { code, message: { uz: msg, ru: msg, en: msg } },
    };
  }
}