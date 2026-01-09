import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

dotenv.config(); // .env faylini majburan yuklash

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});