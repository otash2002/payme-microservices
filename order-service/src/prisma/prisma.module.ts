import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Buni yozmasangiz boshqa modullar Prisma'ni ko'rmaydi
})
export class PrismaModule {}