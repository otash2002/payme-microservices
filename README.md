Payme To'lov Tizimi Integratsiyasi (Microservices)
Ushbu loyiha NestJS, Prisma, PostgreSQL va RabbitMQ texnologiyalari yordamida qurilgan mikroservislar arxitekturasini o'z ichiga oladi. Loyihada Payme to'lov tizimining to'liq tranzaksiya sikli amalga oshirilgan.

🚀 Texnologiyalar
Framework: NestJS

Database: PostgreSQL (Prisma ORM)

Message Broker: RabbitMQ (Servislararo aloqa uchun)

API: JSON-RPC (Payme standarti)

🏗 Arxitektura Mantiqi
Loyiha ikkita asosiy servisdan iborat:

Order Service: Buyurtmalarni boshqaradi. Buyurtma yaratilganda RabbitMQ orqali order_created xabarini yuboradi.

Payment Service: To'lovlarni boshqaradi. RabbitMQ orqali xabarni qabul qiladi va Payme API so'rovlariga javob beradi.

🛠 To'lov Bosqichlari (Test qilish tartibi)
1. Buyurtma yaratish
Avval Order Servicega so'rov yuborib, buyurtma ID-sini olamiz.

POST /orders

Body: {"amount": 50000, "userPhone": "+99890..."}

2. Payme Tekshiruvi (CheckPerformTransaction)
Payme buyurtma mavjudligi va to'lovga tayyorligini tekshiradi.

Method: CheckPerformTransaction

Natija: allow: true

3. Tranzaksiya yaratish (CreateTransaction)
Payme tranzaksiyani boshlaydi. Bazada buyurtma holati state: 1 (band qilingan) holatiga o'tadi.

Method: CreateTransaction

Natija: state: 1

4. To'lovni yakunlash (PerformTransaction)
To'lov muvaffaqiyatli amalga oshiriladi. Bazada buyurtma holati state: 2 va status: SUCCESS holatiga o'tadi.

Method: PerformTransaction

Natija: state: 2

📦 Loyihani ishga tushirish
Konteynerlarni yoqish:

Bash

docker-compose up --build
Prisma bazasini tayyorlash:

Bash

npx prisma db push
Servisni ishga tushirish:

Bash

npm run start:dev
🔐 Xavfsizlik
To'lov xavfsizligini ta'minlash uchun Basic Auth va Buffer orqali so'rov yuboruvchini dekod qilish mantiqi ko'zda tutilgan.