import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Income } from './entities/income.entity';
import { Expense } from './entities/expense.entity';
import { CreateIncomeDto } from './dto/create-income.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Income)
    private incomeRepository: Repository<Income>,
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) { }

  async createIncome(createIncomeDto: CreateIncomeDto) {
    const income = this.incomeRepository.create(createIncomeDto);
    return await this.incomeRepository.save(income);
  }

  async findAllIncome() {
    return await this.incomeRepository.find({ order: { date: 'DESC' } });
  }

  async createExpense(createExpenseDto: CreateExpenseDto) {
    const expense = this.expenseRepository.create(createExpenseDto);
    return await this.expenseRepository.save(expense);
  }

  async findAllExpenses() {
    return await this.expenseRepository.find({ order: { date: 'DESC' } });
  }

  async calculateRevenue(projectId?: string) {
    let incomeQuery = this.incomeRepository.createQueryBuilder('income');
    let expenseQuery = this.expenseRepository.createQueryBuilder('expense');

    if (projectId) {
      incomeQuery = incomeQuery.where('income.projectId = :projectId', { projectId });
      expenseQuery = expenseQuery.where('expense.projectId = :projectId', { projectId });
    }

    const { totalIncome } = await incomeQuery.select('SUM(income.amount)', 'totalIncome').getRawOne();
    const { totalExpense } = await expenseQuery.select('SUM(expense.amount)', 'totalExpense').getRawOne();

    const revenue = (Number(totalIncome) || 0) - (Number(totalExpense) || 0);

    return {
      totalIncome: Number(totalIncome) || 0,
      totalExpense: Number(totalExpense) || 0,
      netProfit: revenue,
      revenue
    };
  }

  async getDashboardStats() {
    return this.calculateRevenue();
  }
}
