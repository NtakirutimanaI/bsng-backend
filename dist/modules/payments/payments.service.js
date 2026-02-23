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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./entities/payment.entity");
let PaymentsService = class PaymentsService {
    paymentsRepository;
    constructor(paymentsRepository) {
        this.paymentsRepository = paymentsRepository;
    }
    create(data) {
        const payment = this.paymentsRepository.create(data);
        return this.paymentsRepository.save(payment);
    }
    async findAll(page = 1, limit = 10, search = '', type = 'all', status = 'all') {
        const queryBuilder = this.paymentsRepository.createQueryBuilder('payment');
        if (search) {
            queryBuilder.andWhere('(payment.code ILIKE :search OR payment.description ILIKE :search OR payment.payer ILIKE :search OR payment.payee ILIKE :search)', { search: `%${search}%` });
        }
        if (type && type !== 'all') {
            queryBuilder.andWhere('payment.type = :type', { type });
        }
        if (status && status !== 'all') {
            queryBuilder.andWhere('payment.status = :status', { status });
        }
        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('payment.createdAt', 'DESC')
            .getManyAndCount();
        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }
    findOne(id) {
        return this.paymentsRepository.findOne({ where: { id } });
    }
    async update(id, data) {
        await this.paymentsRepository.update(id, data);
        return this.findOne(id);
    }
    remove(id) {
        return this.paymentsRepository.delete(id);
    }
    async getMonthlyStats() {
        const rawData = await this.paymentsRepository
            .createQueryBuilder('payment')
            .select("to_char(payment.createdAt, 'Mon')", 'month')
            .addSelect("SUM(CASE WHEN payment.type = 'client_payment' AND payment.status = 'completed' THEN CAST(payment.amount AS DECIMAL) ELSE 0 END)", 'revenue')
            .addSelect("SUM(CASE WHEN payment.type IN ('salary', 'contractor', 'supplier', 'expense') AND payment.status = 'completed' THEN CAST(payment.amount AS DECIMAL) ELSE 0 END)", 'expenses')
            .groupBy("to_char(payment.createdAt, 'Mon')")
            .addGroupBy('EXTRACT(MONTH FROM payment.createdAt)')
            .orderBy('EXTRACT(MONTH FROM payment.createdAt)', 'ASC')
            .getRawMany();
        if (rawData.length === 0) {
            return [];
        }
        return rawData.map((r) => ({
            month: r.month,
            revenue: parseFloat(r.revenue) || 0,
            expenses: parseFloat(r.expenses) || 0,
        }));
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map