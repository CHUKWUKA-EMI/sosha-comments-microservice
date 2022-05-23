import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');
config();
async function bootstrap() {
  const port = process.env.PORT || 4002;
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      url: process.env.REDIS_URL,
    },
  });
  await app.startAllMicroservices();
  await app.listen(port);

  logger.log(`Comments Microservice is running`);
}
bootstrap();
