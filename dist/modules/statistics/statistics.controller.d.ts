import { StatisticsService } from './statistics.service';
export declare class StatisticsController {
    private readonly statisticsService;
    constructor(statisticsService: StatisticsService);
    track(body: {
        url: string;
        userId?: string;
        country?: string;
        city?: string;
    }, ipAddress: string, userAgent: string): Promise<import("./entities/page-view.entity").PageView>;
    getAnalytics(): Promise<{
        overview: {
            daily: number;
            weekly: number;
            monthly: number;
        };
        countries: any[];
        topMembers: any[];
    }>;
}
