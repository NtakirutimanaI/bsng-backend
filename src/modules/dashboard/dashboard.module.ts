import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dashboard } from './entities/dashboard.entity';
import { DashboardWidget } from './entities/dashboard-widget.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller'; // Assuming I will create this
import { ProjectsModule } from '../projects/projects.module';
import { EmployeesModule } from '../employees/employees.module';
import { PropertiesModule } from '../properties/properties.module';
import { PaymentsModule } from '../payments/payments.module';
import { SponsorsModule } from '../sponsors/sponsors.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dashboard, DashboardWidget]),
    ProjectsModule,
    EmployeesModule,
    PropertiesModule,
    PaymentsModule,
    SponsorsModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
