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
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const income_entity_1 = require("./entities/income.entity");
const expense_entity_1 = require("./entities/expense.entity");
let FinanceService = class FinanceService {
    incomeRepository;
    expenseRepository;
    constructor(incomeRepository, expenseRepository) {
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
    }
    async createIncome(createIncomeDto) {
        const income = this.incomeRepository.create(createIncomeDto);
        return await this.incomeRepository.save(income);
    }
    async findAllIncome() {
        return await this.incomeRepository.find({ order: { date: 'DESC' } });
    }
    async createExpense(createExpenseDto) {
        const expense = this.expenseRepository.create(createExpenseDto);
        return await this.expenseRepository.save(expense);
    }
    async findAllExpenses() {
        return await this.expenseRepository.find({ order: { date: 'DESC' } });
    }
    async calculateRevenue(projectId) {
        let incomeQuery = this.incomeRepository.createQueryBuilder('income');
        let expenseQuery = this.expenseRepository.createQueryBuilder('expense');
        if (projectId) {
            incomeQuery = incomeQuery.where('income.projectId = :projectId', { projectId });
            expenseQuery = expenseQuery.where('expense.projectId = :projectId', { projectId });
        }
        const { totalIncome } = await incomeQuery.select('SUM(income.amount)', 'totalIncome').getRawOne();
        const { totalExpense } = await expenseQuery.select('SUM(expense.amount)', 'totalExpense').getRawOne();
        const revenue = (Number(totalIncome) || 0) - (Number(totalExpense) || 0);
        return {
            totalIncome: Number(totalIncome) || 0,
            totalExpense: Number(totalExpense) || 0,
            netProfit: revenue,
            revenue
        };
    }
    async getDashboardStats() {
        return this.calculateRevenue();
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(income_entity_1.Income)),
    __param(1, (0, typeorm_1.InjectRepository)(expense_entity_1.Expense)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FinanceService);
//# sourceMappingURL=finance.service.js.map