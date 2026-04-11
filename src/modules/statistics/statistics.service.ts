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

        // Group by city
        const cityStats = await this.pageViewRepository
            .createQueryBuilder('pv')
            .select('pv.city', 'city')
            .addSelect('COUNT(*)', 'count')
            .groupBy('pv.city')
            .orderBy('count', 'DESC')
            .limit(10)
            .getRawMany();

        // Recent Visitors
        const recentVisitors = await this.pageViewRepository
            .createQueryBuilder('pv')
            .select(['pv.id', 'pv.ip', 'pv.country', 'pv.city', 'pv.url', 'pv.createdAt'])
            .orderBy('pv.createdAt', 'DESC')
            .limit(50)
            .getMany();

        // Last 7 days trend
        const dailyTrend = await this.pageViewRepository
            .createQueryBuilder('pv')
            .select("to_char(pv.created_at, 'YYYY-MM-DD')", 'date')
            .addSelect('COUNT(*)', 'visits')
            .where('pv.createdAt >= :weekAgo', { weekAgo })
            .groupBy("to_char(pv.created_at, 'YYYY-MM-DD')")
            .orderBy('date', 'ASC')
            .getRawMany();

        return {
            overview: { daily, weekly, monthly },
            countries: countryStats,
            cities: cityStats,
            recentVisitors,
            dailyTrend,
        };
    }
}
