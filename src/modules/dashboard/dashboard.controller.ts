import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('stats')
  async getStats(@Req() req, @Query('role') role: string = 'admin') {
    return this.dashboardService.getStats(role, req.user.id);
  }

  @Get('recent-activity')
  async getRecentActivity() {
    return this.dashboardService.getRecentActivity();
  }
}
