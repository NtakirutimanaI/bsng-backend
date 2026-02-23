import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dashboard } from './entities/dashboard.entity';
import { DashboardWidget } from './entities/dashboard-widget.entity';
import { ProjectsService } from '../projects/projects.service';
import { EmployeesService } from '../employees/employees.service';
import { PropertiesService } from '../properties/properties.service';
import { PaymentsService } from '../payments/payments.service';
import { SponsorsService } from '../sponsors/sponsors.service';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Dashboard)
    private dashboardsRepository: Repository<Dashboard>,
    @InjectRepository(DashboardWidget)
    private widgetsRepository: Repository<DashboardWidget>,
    private projectsService: ProjectsService,
    private employeesService: EmployeesService,
    private propertiesService: PropertiesService,
    private paymentsService: PaymentsService,
    private sponsorsService: SponsorsService,
  ) {}

  async createDashboard(data: Partial<Dashboard>): Promise<Dashboard> {
    const dashboard = this.dashboardsRepository.create(data);
    return this.dashboardsRepository.save(dashboard);
  }

  async createWidget(data: Partial<DashboardWidget>): Promise<DashboardWidget> {
    const widget = this.widgetsRepository.create(data);
    return this.widgetsRepository.save(widget);
  }

  async getDashboardsForRole(roleId: string): Promise<Dashboard[]> {
    return this.dashboardsRepository.find({
      where: { roleId },
      relations: ['widgets'],
    });
  }

  async getStats(role: string) {
    // Fetch real counts using existing services
    const projects = await this.projectsService.findAll(1, 1);
    const employees = await this.employeesService.findAll(1, 1);
    const properties = await this.propertiesService.findAll(1, 1);
    const payments = await this.paymentsService.findAll(1, 1000);

    // Calculate Revenue (Total client_payment income)
    const totalRevenue = payments.data
      .filter((p) => p.type === 'client_payment' && p.status === 'completed')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    // Calculate Expenses (Total salary/contractor/supplier)
    const totalExpenses = payments.data
      .filter(
        (p) =>
          ['salary', 'contractor', 'supplier', 'expense'].includes(p.type) &&
          p.status === 'completed',
      )
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const monthlyStats = await this.paymentsService.getMonthlyStats();
    const projectStatusCounts =
      await this.projectsService.getProjectStatusCounts();

    const stats: any = {
      adminStats: [
        {
          name: 'Active Projects',
          value: projects.total.toString(),
          change: '+2',
          trend: 'up',
        },
        {
          name: 'Total Employees',
          value: employees.total.toString(),
          change: '+5',
          trend: 'up',
        },
        {
          name: 'Properties',
          value: properties.total.toString(),
          change: '+3',
          trend: 'up',
        },
        {
          name: 'Total Revenue',
          value: `RWF ${(totalRevenue / 1000000).toFixed(1)}M`,
          change: '+12%',
          trend: 'up',
        },
      ],
      publicStats: {
        projectsCompleted: projects.total,
        happyClients: 15,
        teamMembers: employees.total,
        yearsExperience: 2,
      },
      revenueStats: {
        income: totalRevenue,
        expenses: totalExpenses,
        chartData: monthlyStats,
      },
      latestProjects: projects.data,
      projectStatusCounts,
    };

    // Add role-specific data
    if (role === 'employee') {
      stats.employeeStats = [
        { name: 'My Assignments', value: '4', change: 'Active', trend: 'up' },
        {
          name: 'Hours Worked',
          value: '38h',
          change: 'This week',
          trend: 'up',
        },
        {
          name: 'Pending Tasks',
          value: '7',
          change: 'Due soon',
          trend: 'down',
        },
        {
          name: 'Next Payday',
          value: 'Feb 28',
          change: 'Confirmed',
          trend: 'up',
        },
      ];
    } else if (role === 'client') {
      stats.clientStats = [
        { name: 'My Properties', value: '1', change: 'Occupied', trend: 'up' },
        {
          name: 'Payment Status',
          value: 'Paid',
          change: 'Feb 2026',
          trend: 'up',
        },
        {
          name: 'Next Rent Due',
          value: 'Mar 01',
          change: 'In 21 days',
          trend: 'up',
        },
        {
          name: 'Support Tickets',
          value: '0',
          change: 'All clear',
          trend: 'up',
        },
      ];
    } else if (role === 'contractor') {
      stats.contractorStats = [
        {
          name: 'Active Contracts',
          value: '2',
          change: 'Ongoing',
          trend: 'up',
        },
        {
          name: 'Completed Work',
          value: '85%',
          change: '+5% week',
          trend: 'up',
        },
        {
          name: 'Pending Invoices',
          value: '1',
          change: 'RWF 1.2M',
          trend: 'up',
        },
        {
          name: 'Upcoming Deadlines',
          value: '3',
          change: 'Priority',
          trend: 'down',
        },
      ];
    } else if (role === 'site_manager') {
      stats.siteManagerStats = [
        {
          name: 'On-site Personnel',
          value: '24',
          change: '+4 today',
          trend: 'up',
        },
        {
          name: 'Project Progress',
          value: '68%',
          change: '+2% week',
          trend: 'up',
        },
        {
          name: 'Material Requests',
          value: '3',
          change: 'Pending',
          trend: 'warning',
        },
        {
          name: 'Daily Reports',
          value: '12/12',
          change: 'Complete',
          trend: 'up',
        },
      ];
    } else if (role === 'manager') {
      stats.managerStats = [
        {
          name: 'Total Budget',
          value: 'RWF 850M',
          change: 'Planned',
          trend: 'up',
        },
        {
          name: 'Budget Utilized',
          value: '42%',
          change: 'On track',
          trend: 'up',
        },
        {
          name: 'Staff Retention',
          value: '98%',
          change: 'Monthly',
          trend: 'up',
        },
        {
          name: 'Strategic Goals',
          value: '4/5',
          change: 'In progress',
          trend: 'up',
        },
      ];
    }

    return stats;
  }
}
