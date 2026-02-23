"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const dashboard_entity_1 = require("./entities/dashboard.entity");
const dashboard_widget_entity_1 = require("./entities/dashboard-widget.entity");
const projects_service_1 = require("../projects/projects.service");
const employees_service_1 = require("../employees/employees.service");
const properties_service_1 = require("../properties/properties.service");
const payments_service_1 = require("../payments/payments.service");
const sponsors_service_1 = require("../sponsors/sponsors.service");
let DashboardService = class DashboardService {
    dashboardsRepository;
    widgetsRepository;
    projectsService;
    employeesService;
    propertiesService;
    paymentsService;
    sponsorsService;
    constructor(dashboardsRepository, widgetsRepository, projectsService, employeesService, propertiesService, paymentsService, sponsorsService) {
        this.dashboardsRepository = dashboardsRepository;
        this.widgetsRepository = widgetsRepository;
        this.projectsService = projectsService;
        this.employeesService = employeesService;
        this.propertiesService = propertiesService;
        this.paymentsService = paymentsService;
        this.sponsorsService = sponsorsService;
    }
    async createDashboard(data) {
        const dashboard = this.dashboardsRepository.create(data);
        return this.dashboardsRepository.save(dashboard);
    }
    async createWidget(data) {
        const widget = this.widgetsRepository.create(data);
        return this.widgetsRepository.save(widget);
    }
    async getDashboardsForRole(roleId) {
        return this.dashboardsRepository.find({
            where: { roleId },
            relations: ['widgets'],
        });
    }
    async getStats(role) {
        const projects = await this.projectsService.findAll(1, 1);
        const employees = await this.employeesService.findAll(1, 1);
        const properties = await this.propertiesService.findAll(1, 1);
        const payments = await this.paymentsService.findAll(1, 1000);
        const totalRevenue = payments.data
            .filter((p) => p.type === 'client_payment' && p.status === 'completed')
            .reduce((sum, p) => sum + Number(p.amount), 0);
        const totalExpenses = payments.data
            .filter((p) => ['salary', 'contractor', 'supplier', 'expense'].includes(p.type) &&
            p.status === 'completed')
            .reduce((sum, p) => sum + Number(p.amount), 0);
        const monthlyStats = await this.paymentsService.getMonthlyStats();
        const projectStatusCounts = await this.projectsService.getProjectStatusCounts();
        const stats = {
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
        }
        else if (role === 'client') {
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
        }
        else if (role === 'contractor') {
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
        }
        else if (role === 'site_manager') {
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
        }
        else if (role === 'manager') {
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(dashboard_entity_1.Dashboard)),
    __param(1, (0, typeorm_1.InjectRepository)(dashboard_widget_entity_1.DashboardWidget)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        projects_service_1.ProjectsService,
        employees_service_1.EmployeesService,
        properties_service_1.PropertiesService,
        payments_service_1.PaymentsService,
        sponsors_service_1.SponsorsService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map