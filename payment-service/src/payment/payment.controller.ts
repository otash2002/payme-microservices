import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @MessagePattern('order_created')
  async handleOrderCreated(data: any) {
    console.log('Yangi buyurtma qabul qilindi:', data);
    return await this.paymentService.processPayment(data);
  }
}