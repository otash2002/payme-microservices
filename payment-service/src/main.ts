import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // 1. HTTP so'rovlar uchun oddiy NestFactory yaratamiz
  const app = await NestFactory.create(AppModule);

  // 2. RabbitMQ mikroservisini "Hybrid" ko'rinishda qo'shamiz
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'payment_queue',
      queueOptions: { durable: false }
    },
  });

  // 3. Mikroservisni ishga tushiramiz
  await app.startAllMicroservices();

  // 4. HTTP portini (3001) eshitishni boshlaymiz
  await app.listen(3001);
  
  console.log('Payment Service Hybrid rejimda ishga tushdi:');
  console.log('- HTTP: http://localhost:3001');
  console.log('- Microservice: RabbitMQ (payment_queue)');
}
bootstrap();