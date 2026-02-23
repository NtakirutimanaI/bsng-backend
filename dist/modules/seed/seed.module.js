"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedModule = void 0;
const common_1 = require("@nestjs/common");
const seed_service_1 = require("./seed.service");
const rbac_module_1 = require("../rbac/rbac.module");
const users_module_1 = require("../users/users.module");
const projects_module_1 = require("../projects/projects.module");
const properties_module_1 = require("../properties/properties.module");
const payments_module_1 = require("../payments/payments.module");
const sponsors_module_1 = require("../sponsors/sponsors.module");
const updates_module_1 = require("../updates/updates.module");
const settings_module_1 = require("../settings/settings.module");
const services_module_1 = require("../services/services.module");
const employees_module_1 = require("../employees/employees.module");
let SeedModule = class SeedModule {
};
exports.SeedModule = SeedModule;
exports.SeedModule = SeedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            rbac_module_1.RbacModule,
            users_module_1.UsersModule,
            projects_module_1.ProjectsModule,
            properties_module_1.PropertiesModule,
            payments_module_1.PaymentsModule,
            sponsors_module_1.SponsorsModule,
            updates_module_1.UpdatesModule,
            settings_module_1.SettingsModule,
            services_module_1.ServicesModule,
            employees_module_1.EmployeesModule,
        ],
        providers: [seed_service_1.SeedService],
    })
], SeedModule);
//# sourceMappingURL=seed.module.js.map