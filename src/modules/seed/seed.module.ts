import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { RbacModule } from '../rbac/rbac.module';
import { UsersModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';
import { PropertiesModule } from '../properties/properties.module';
import { PaymentsModule } from '../payments/payments.module';
import { SponsorsModule } from '../sponsors/sponsors.module';
import { UpdatesModule } from '../updates/updates.module';
import { SettingsModule } from '../settings/settings.module';
import { ServicesModule } from '../services/services.module';
import { EmployeesModule } from '../employees/employees.module';
import { EventsModule } from '../events/events.module';
import { SitesModule } from '../sites/sites.module';

@Module({
  imports: [
    RbacModule,
    UsersModule,
    ProjectsModule,
    PropertiesModule,
    PaymentsModule,
    SponsorsModule,
    UpdatesModule,
    SettingsModule,
    ServicesModule,
    EmployeesModule,
    EventsModule,
    SitesModule,
  ],
  providers: [SeedService],
})
export class SeedModule { }
