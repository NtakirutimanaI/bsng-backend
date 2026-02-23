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
exports.SalaryPayment = void 0;
const typeorm_1 = require("typeorm");
const employee_entity_1 = require("./employee.entity");
let SalaryPayment = class SalaryPayment {
    id;
    employeeId;
    employee;
    amount;
    baseSalary;
    daysAttended;
    totalHours;
    currency;
    paymentMethod;
    recipientAccount;
    transactionId;
    paymentProvider;
    status;
    failureReason;
    salaryMonth;
    salaryYear;
    description;
    initiatedBy;
    createdAt;
    updatedAt;
};
exports.SalaryPayment = SalaryPayment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SalaryPayment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SalaryPayment.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], SalaryPayment.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 14, scale: 2 }),
    __metadata("design:type", Number)
], SalaryPayment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SalaryPayment.prototype, "baseSalary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], SalaryPayment.prototype, "daysAttended", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 7, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], SalaryPayment.prototype, "totalHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'RWF' }),
    __metadata("design:type", String)
], SalaryPayment.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SalaryPayment.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SalaryPayment.prototype, "recipientAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SalaryPayment.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'africastalking' }),
    __metadata("design:type", String)
], SalaryPayment.prototype, "paymentProvider", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], SalaryPayment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], SalaryPayment.prototype, "failureReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SalaryPayment.prototype, "salaryMonth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SalaryPayment.prototype, "salaryYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SalaryPayment.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SalaryPayment.prototype, "initiatedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SalaryPayment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SalaryPayment.prototype, "updatedAt", void 0);
exports.SalaryPayment = SalaryPayment = __decorate([
    (0, typeorm_1.Entity)('salary_payments')
], SalaryPayment);
//# sourceMappingURL=salary-payment.entity.js.map