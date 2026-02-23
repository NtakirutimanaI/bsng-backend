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
exports.DashboardWidget = void 0;
const typeorm_1 = require("typeorm");
const dashboard_entity_1 = require("./dashboard.entity");
let DashboardWidget = class DashboardWidget {
    id;
    dashboardId;
    dashboard;
    widgetType;
    title;
    config;
    positionX;
    positionY;
    width;
    height;
    createdAt;
};
exports.DashboardWidget = DashboardWidget;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DashboardWidget.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dashboard_id' }),
    __metadata("design:type", String)
], DashboardWidget.prototype, "dashboardId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dashboard_entity_1.Dashboard, (dashboard) => dashboard.widgets, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'dashboard_id' }),
    __metadata("design:type", dashboard_entity_1.Dashboard)
], DashboardWidget.prototype, "dashboard", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'widget_type', length: 50 }),
    __metadata("design:type", String)
], DashboardWidget.prototype, "widgetType", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], DashboardWidget.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], DashboardWidget.prototype, "config", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'position_x' }),
    __metadata("design:type", Number)
], DashboardWidget.prototype, "positionX", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'position_y' }),
    __metadata("design:type", Number)
], DashboardWidget.prototype, "positionY", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DashboardWidget.prototype, "width", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DashboardWidget.prototype, "height", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], DashboardWidget.prototype, "createdAt", void 0);
exports.DashboardWidget = DashboardWidget = __decorate([
    (0, typeorm_1.Entity)('dashboard_widgets')
], DashboardWidget);
//# sourceMappingURL=dashboard-widget.entity.js.map