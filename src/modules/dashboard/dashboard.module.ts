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
import { AssignmentsModule } from '../assignments/assignments.module';
import { TasksModule } from '../tasks/tasks.module';
import { UsersModule } from '../users/users.module';
import { ActivitiesModule } from '../activities/activities.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dashboard, DashboardWidget]),
    ProjectsModule,
    EmployeesModule,
    PropertiesModule,
    PaymentsModule,
    SponsorsModule,
    AssignmentsModule,
    TasksModule,
    UsersModule,
    ActivitiesModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
