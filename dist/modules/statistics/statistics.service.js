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
exports.StatisticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const page_view_entity_1 = require("./entities/page-view.entity");
let StatisticsService = class StatisticsService {
    pageViewRepository;
    constructor(pageViewRepository) {
        this.pageViewRepository = pageViewRepository;
    }
    async trackView(data) {
        const view = this.pageViewRepository.create(data);
        return this.pageViewRepository.save(view);
    }
    async getAnalyticsSummary() {
        const now = new Date();
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const [daily, weekly, monthly] = await Promise.all([
            this.pageViewRepository.count({ where: { createdAt: (0, typeorm_2.MoreThanOrEqual)(dayAgo) } }),
            this.pageViewRepository.count({ where: { createdAt: (0, typeorm_2.MoreThanOrEqual)(weekAgo) } }),
            this.pageViewRepository.count({ where: { createdAt: (0, typeorm_2.MoreThanOrEqual)(monthAgo) } }),
        ]);
        const countryStats = await this.pageViewRepository
            .createQueryBuilder('pv')
            .select('pv.country', 'country')
            .addSelect('COUNT(*)', 'count')
            .groupBy('pv.country')
            .orderBy('count', 'DESC')
            .limit(10)
            .getRawMany();
        const topMembers = await this.pageViewRepository
            .createQueryBuilder('pv')
            .leftJoin('pv.user', 'user')
            .select('user.fullName', 'name')
            .addSelect('user.email', 'email')
            .addSelect('COUNT(*)', 'visits')
            .where('pv.userId IS NOT NULL')
            .groupBy('user.id')
            .addGroupBy('user.fullName')
            .addGroupBy('user.email')
            .orderBy('visits', 'DESC')
            .limit(10)
            .getRawMany();
        return {
            overview: { daily, weekly, monthly },
            countries: countryStats,
            topMembers,
        };
    }
};
exports.StatisticsService = StatisticsService;
exports.StatisticsService = StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(page_view_entity_1.PageView)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StatisticsService);
//# sourceMappingURL=statistics.service.js.map