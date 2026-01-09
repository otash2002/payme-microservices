import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // RabbitMQ qismi (o'zgarishsiz qoladi)
  @MessagePattern('order_created')
  async handleOrderCreated(@Payload() data: any) {
    return await this.paymentService.processPayment(data);
  }

  // Payme HTTP qismi (Endi Service-ga ulanadi)
// payment.controller.ts

@Post('payme')
async handlePayme(@Body() body: any) {
  const { method, params, id } = body;

  switch (method) {
    case 'CheckPerformTransaction':
      return await this.paymentService.checkPerformTransaction(params, id);
    
    case 'CreateTransaction':
      return await this.paymentService.createTransaction(params, id);

    // MANA SHU CASE BORLIGINI TEKSHIRING:
    case 'PerformTransaction':
      return await this.paymentService.performTransaction(params, id);

    default:
      return {
        jsonrpc: '2.0',
        id: id,
        error: { code: -32601, message: 'Method not found' },
      };
  }
}
}