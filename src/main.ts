import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  const PORT = process.env.PORT ?? 3000;

  // Listen on all interfaces for Render
  await app.listen(process.env.PORT ?? 3000);

  console.log(`Application is running on port ${PORT}`);
}
bootstrap();