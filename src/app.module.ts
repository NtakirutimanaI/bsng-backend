import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ExcelModule } from './modules/excel/excel.module';
import { SeedModule } from './modules/seed/seed.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SponsorsModule } from './modules/sponsors/sponsors.module';
import { UpdatesModule } from './modules/updates/updates.module';
import { SettingsModule } from './modules/settings/settings.module';
import { MessagesModule } from './modules/messages/messages.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { ServicesModule } from './modules/services/services.module';
import { ContentModule } from './modules/content/content.module';
import { SitesModule } from './modules/sites/sites.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { FinanceModule } from './modules/finance/finance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'bsng_db'),
        autoLoadEntities: true,
        synchronize: true, // Use carefully in production
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    RbacModule,
    DashboardModule,
    ExcelModule,
    SeedModule,
    ProjectsModule,
    PropertiesModule,
    PaymentsModule,
    SponsorsModule,
    UpdatesModule,
    SettingsModule,
    MessagesModule,
    EmployeesModule,
    AuthModule,
    BookingsModule,
    NotificationsModule,
    StatisticsModule,
    ServicesModule,
    ContentModule,
    SitesModule,
    ContractsModule,
    AssignmentsModule,
    FinanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
