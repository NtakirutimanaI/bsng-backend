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

  async findAllIncome(siteId?: string) {
    const where = siteId ? { siteId } : {};
    return await this.incomeRepository.find({
      where,
      order: { date: 'DESC' },
      relations: ['site'],
    });
  }

  async createExpense(createExpenseDto: CreateExpenseDto) {
    const expense = this.expenseRepository.create(createExpenseDto);
    return await this.expenseRepository.save(expense);
  }

  async findAllExpenses(siteId?: string) {
    const where = siteId ? { siteId } : {};
    return await this.expenseRepository.find({
      where,
      order: { date: 'DESC' },
      relations: ['site'],
    });
  }

  async calculateRevenue(projectId?: string, siteId?: string) {
    let incomeQuery = this.incomeRepository.createQueryBuilder('income');
    let expenseQuery = this.expenseRepository.createQueryBuilder('expense');

    if (projectId) {
      incomeQuery = incomeQuery.andWhere('income.projectId = :projectId', { projectId });
      expenseQuery = expenseQuery.andWhere('expense.projectId = :projectId', { projectId });
    }

    if (siteId) {
      incomeQuery = incomeQuery.andWhere('income.siteId = :siteId', { siteId });
      expenseQuery = expenseQuery.andWhere('expense.siteId = :siteId', { siteId });
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

  async getDashboardStats(siteId?: string) {
    return this.calculateRevenue(undefined, siteId);
  }
}
