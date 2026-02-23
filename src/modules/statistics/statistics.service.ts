import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { PageView } from './entities/page-view.entity';

@Injectable()
export class StatisticsService {
    constructor(
        @InjectRepository(PageView)
        private pageViewRepository: Repository<PageView>,
    ) { }

    async trackView(data: Partial<PageView>) {
        const view = this.pageViewRepository.create(data);
        return this.pageViewRepository.save(view);
    }

    async getAnalyticsSummary() {
        const now = new Date();
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [daily, weekly, monthly] = await Promise.all([
            this.pageViewRepository.count({ where: { createdAt: MoreThanOrEqual(dayAgo) } }),
            this.pageViewRepository.count({ where: { createdAt: MoreThanOrEqual(weekAgo) } }),
            this.pageViewRepository.count({ where: { createdAt: MoreThanOrEqual(monthAgo) } }),
        ]);

        // Group by country
        const countryStats = await this.pageViewRepository
            .createQueryBuilder('pv')
            .select('pv.country', 'country')
            .addSelect('COUNT(*)', 'count')
            .groupBy('pv.country')
            .orderBy('count', 'DESC')
            .limit(10)
            .getRawMany();

        // Most active members (if logged in)
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
}
