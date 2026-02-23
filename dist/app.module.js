"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./modules/users/users.module");
const rbac_module_1 = require("./modules/rbac/rbac.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const excel_module_1 = require("./modules/excel/excel.module");
const seed_module_1 = require("./modules/seed/seed.module");
const projects_module_1 = require("./modules/projects/projects.module");
const properties_module_1 = require("./modules/properties/properties.module");
const payments_module_1 = require("./modules/payments/payments.module");
const sponsors_module_1 = require("./modules/sponsors/sponsors.module");
const updates_module_1 = require("./modules/updates/updates.module");
const settings_module_1 = require("./modules/settings/settings.module");
const messages_module_1 = require("./modules/messages/messages.module");
const employees_module_1 = require("./modules/employees/employees.module");
const auth_module_1 = require("./modules/auth/auth.module");
const bookings_module_1 = require("./modules/bookings/bookings.module");
const notifications_module_1 = require("./notifications/notifications.module");
const statistics_module_1 = require("./modules/statistics/statistics.module");
const services_module_1 = require("./modules/services/services.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USERNAME', 'postgres'),
                    password: configService.get('DB_PASSWORD', 'postgres'),
                    database: configService.get('DB_NAME', 'bsng_db'),
                    autoLoadEntities: true,
                    synchronize: true,
                }),
                inject: [config_1.ConfigService],
            }),
            users_module_1.UsersModule,
            rbac_module_1.RbacModule,
            dashboard_module_1.DashboardModule,
            excel_module_1.ExcelModule,
            seed_module_1.SeedModule,
            projects_module_1.ProjectsModule,
            properties_module_1.PropertiesModule,
            payments_module_1.PaymentsModule,
            sponsors_module_1.SponsorsModule,
            updates_module_1.UpdatesModule,
            settings_module_1.SettingsModule,
            messages_module_1.MessagesModule,
            employees_module_1.EmployeesModule,
            auth_module_1.AuthModule,
            bookings_module_1.BookingsModule,
            notifications_module_1.NotificationsModule,
            statistics_module_1.StatisticsModule,
            services_module_1.ServicesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map