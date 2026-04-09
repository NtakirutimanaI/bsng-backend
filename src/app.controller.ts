import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('debug')
  getDebug() {
    return {
      hasDbHost: !!process.env.DB_HOST,
      hostLength: process.env.DB_HOST?.length || 0,
      port: process.env.DB_PORT,
      hasPassword: !!process.env.DB_PASSWORD,
      jwtSecretExists: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV,
    };
  }
}
