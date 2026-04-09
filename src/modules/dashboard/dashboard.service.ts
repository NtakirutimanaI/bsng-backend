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
import { ActivitiesService } from '../activities/activities.service';
import { AssignmentsService } from '../assignments/assignments.service';
import { TasksService } from '../tasks/tasks.service';
import { UsersService } from '../users/users.service';

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
    private activitiesService: ActivitiesService,
    private assignmentsService: AssignmentsService,
    private tasksService: TasksService,
    private usersService: UsersService,
  ) { }

  async getStats(role: string, userId: string) {
    // Fetch all real counts in parallel
    const [
      projects,
      employees,
      properties,
      payments,
      monthlyStats,
      projectStatusCounts,
      user,
      allTasks
    ] = await Promise.all([
      this.projectsService.findAll(1, 1),
      this.employeesService.findAll(1, 1),
      this.propertiesService.findAll(1, 1),
      this.paymentsService.findAll(1, 1000),
      this.paymentsService.getMonthlyStats(),
      this.projectsService.getProjectStatusCounts(),
      this.usersService.findOne(userId),
      this.tasksService.findAll(userId, role)
    ]);

    // Calculate Revenue
    const totalRevenue = payments.data
      .filter((p) => p.type === 'client_payment' && ['completed', 'paid'].includes(p.status))
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    // Calculate Expenses
    const totalExpenses = payments.data
      .filter(
        (p) =>
          ['salary', 'contractor', 'supplier', 'expense'].includes(p.type) &&
          ['completed', 'paid'].includes(p.status),
      )
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

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
      revenueStats: {
        income: totalRevenue,
        expenses: totalExpenses,
        chartData: monthlyStats,
      },
      latestProjects: projects.data,
      projectStatusCounts,
      tasks: allTasks,
    };

    // Role-specific dynamic stats
    if (role === 'employee') {
      const employee = await this.employeesService.findByEmail(user.email);
      const myAssignmentsCount = employee ? await this.assignmentsService.countAssignments({ employeeId: employee.id }) : 0;
      
      stats.employeeStats = [
        { name: 'My Assignments', value: myAssignmentsCount.toString(), change: 'Active', trend: 'up' },
        { name: 'Hours Worked', value: `${employee?.attendance || 0}h`, change: 'Total', trend: 'up' },
        { name: 'Pending Tasks', value: allTasks.filter(t => !t.isDone).length.toString(), change: 'Tasks', trend: 'down' },
        { name: 'Base Salary', value: `RWF ${(employee?.baseSalary || 0).toLocaleString()}`, change: employee?.salaryType || 'Monthly', trend: 'up' },
      ];
    } else if (role === 'client') {
      const myPropertiesCount = await this.propertiesService.findAll(1, 100, '', user.id); // Assuming properties can be filtered by user
      const myPayments = payments.data.filter(p => p.payer === user.fullName);
      const totalPaid = myPayments.reduce((sum, p) => sum + Number(p.amount), 0);

      stats.clientStats = [
        { name: 'My Properties', value: myPropertiesCount.total.toString(), change: 'Occupied', trend: 'up' },
        { name: 'Total Paid', value: `RWF ${(totalPaid / 1000000).toFixed(2)}M`, change: 'Invested', trend: 'up' },
        { name: 'Payment Status', value: myPayments.length > 0 ? 'Up-to-date' : 'None', change: 'Status', trend: 'up' },
        { name: 'Support Tickets', value: '0', change: 'All clear', trend: 'up' },
      ];
    }

    return stats;
  }

  async getRecentActivity() {
    return this.activitiesService.findAll(15, 0);
  }
}
