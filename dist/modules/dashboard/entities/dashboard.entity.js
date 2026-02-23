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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
const typeorm_1 = require("typeorm");
const role_entity_1 = require("../../rbac/entities/role.entity");
const dashboard_widget_entity_1 = require("./dashboard-widget.entity");
let Dashboard = class Dashboard {
    id;
    roleId;
    role;
    name;
    layout;
    isDefault;
    createdAt;
    widgets;
};
exports.Dashboard = Dashboard;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Dashboard.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role_id', nullable: true }),
    __metadata("design:type", String)
], Dashboard.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_entity_1.Role),
    (0, typeorm_1.JoinColumn)({ name: 'role_id' }),
    __metadata("design:type", role_entity_1.Role)
], Dashboard.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Dashboard.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], Dashboard.prototype, "layout", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_default', default: false }),
    __metadata("design:type", Boolean)
], Dashboard.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Dashboard.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => dashboard_widget_entity_1.DashboardWidget, (widget) => widget.dashboard),
    __metadata("design:type", Array)
], Dashboard.prototype, "widgets", void 0);
exports.Dashboard = Dashboard = __decorate([
    (0, typeorm_1.Entity)('dashboards')
], Dashboard);
//# sourceMappingURL=dashboard.entity.js.map