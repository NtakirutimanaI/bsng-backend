import { Repository } from 'typeorm';
import { Dashboard } from './entities/dashboard.entity';
import { DashboardWidget } from './entities/dashboard-widget.entity';
import { ProjectsService } from '../projects/projects.service';
import { EmployeesService } from '../employees/employees.service';
import { PropertiesService } from '../properties/properties.service';
import { PaymentsService } from '../payments/payments.service';
import { SponsorsService } from '../sponsors/sponsors.service';
export declare class DashboardService {
    private dashboardsRepository;
    private widgetsRepository;
    private projectsService;
    private employeesService;
    private propertiesService;
    private paymentsService;
    private sponsorsService;
    constructor(dashboardsRepository: Repository<Dashboard>, widgetsRepository: Repository<DashboardWidget>, projectsService: ProjectsService, employeesService: EmployeesService, propertiesService: PropertiesService, paymentsService: PaymentsService, sponsorsService: SponsorsService);
    createDashboard(data: Partial<Dashboard>): Promise<Dashboard>;
    createWidget(data: Partial<DashboardWidget>): Promise<DashboardWidget>;
    getDashboardsForRole(roleId: string): Promise<Dashboard[]>;
    getStats(role: string): Promise<any>;
}
