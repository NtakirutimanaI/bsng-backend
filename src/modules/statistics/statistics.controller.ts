import { Controller, Get, Post, Body, Ip, Headers, Req } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) { }

    @Post('track')
    async track(
        @Body() body: { url: string; userId?: string; country?: string; city?: string },
        @Ip() ipAddress: string,
        @Headers('user-agent') userAgent: string,
    ) {
        return this.statisticsService.trackView({
            ...body,
            ip: ipAddress,
            userAgent,
        });
    }

    @Get('analytics')
    async getAnalytics() {
        return this.statisticsService.getAnalyticsSummary();
    }
}
