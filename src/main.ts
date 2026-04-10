import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import { Express } from 'express';

let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors();
    
    // Support large image uploads
    const express = require('express');
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));

    app.useStaticAssets(join(process.cwd(), 'uploads'), {
      prefix: '/uploads',
    });

    app.useStaticAssets(join(process.cwd(), 'uploads', 'img', 'custom'), {
      prefix: '/img/custom',
    });

    // Middleware to log response times and handle CORS instantly
    app.use((req, res, next) => {
      // Respond instantly to CORS pre-flights
      if (req.method === 'OPTIONS') {
        res.status(204).send();
        return;
      }

      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} - ${duration}ms`);
      });
      next();
    });

    await app.init();
    cachedApp = app.getHttpAdapter().getInstance();
  }
  return cachedApp;
}

// Export for Vercel
export default async (req: any, res: any) => {
  const app = await bootstrap();
  app(req, res);
};

// Standalone mode for local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const startLocal = async () => {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors();
    app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });
    app.useStaticAssets(join(process.cwd(), 'uploads', 'img', 'custom'), { prefix: '/img/custom' });
    
    const PORT = process.env.PORT ?? 3000;
    await app.listen(PORT);
    console.log(`🚀 STANDALONE: Application is running on port ${PORT}`);
  };
  startLocal();
}