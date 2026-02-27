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
  findAllIncome() {
    return this.financeService.findAllIncome();
  }

  @Post('expenses')
  createExpense(@Body() createExpenseDto: CreateExpenseDto) {
    return this.financeService.createExpense(createExpenseDto);
  }

  @Get('expenses')
  findAllExpenses() {
    return this.financeService.findAllExpenses();
  }

  @Get('revenue')
  calculateRevenue(@Query('projectId') projectId?: string) {
    return this.financeService.calculateRevenue(projectId);
  }

  @Get('dashboard')
  getDashboardStats() {
    return this.financeService.getDashboardStats();
  }
}
