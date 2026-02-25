import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const PORT = process.env.PORT ?? 3000;

  // Listen on all interfaces for Render
  await app.listen(process.env.PORT ?? 3000);

  console.log(`Application is running on port ${PORT}`);
}
bootstrap();