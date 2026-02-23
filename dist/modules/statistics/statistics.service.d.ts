import { Repository } from 'typeorm';
import { PageView } from './entities/page-view.entity';
export declare class StatisticsService {
    private pageViewRepository;
    constructor(pageViewRepository: Repository<PageView>);
    trackView(data: Partial<PageView>): Promise<PageView>;
    getAnalyticsSummary(): Promise<{
        overview: {
            daily: number;
            weekly: number;
            monthly: number;
        };
        countries: any[];
        topMembers: any[];
    }>;
}
