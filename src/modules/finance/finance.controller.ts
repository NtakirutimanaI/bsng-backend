import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) { }

  @Post('income')
  createIncome(@Body() createIncomeDto: CreateIncomeDto) {
    return this.financeService.createIncome(createIncomeDto);
  }

  @Get('income')
  findAllIncome(@Query('siteId') siteId?: string) {
    return this.financeService.findAllIncome(siteId);
  }

  @Post('expenses')
  createExpense(@Body() createExpenseDto: CreateExpenseDto) {
    return this.financeService.createExpense(createExpenseDto);
  }

  @Get('expenses')
  findAllExpenses(@Query('siteId') siteId?: string) {
    return this.financeService.findAllExpenses(siteId);
  }

  @Get('revenue')
  calculateRevenue(
    @Query('projectId') projectId?: string,
    @Query('siteId') siteId?: string,
  ) {
    return this.financeService.calculateRevenue(projectId, siteId);
  }

  @Get('dashboard')
  getDashboardStats(@Query('siteId') siteId?: string) {
    return this.financeService.getDashboardStats(siteId);
  }
}
