import { Repository } from 'typeorm';
import { Income } from './entities/income.entity';
import { Expense } from './entities/expense.entity';
import { CreateIncomeDto } from './dto/create-income.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
export declare class FinanceService {
    private incomeRepository;
    private expenseRepository;
    constructor(incomeRepository: Repository<Income>, expenseRepository: Repository<Expense>);
    createIncome(createIncomeDto: CreateIncomeDto): Promise<Income>;
    findAllIncome(): Promise<Income[]>;
    createExpense(createExpenseDto: CreateExpenseDto): Promise<Expense>;
    findAllExpenses(): Promise<Expense[]>;
    calculateRevenue(projectId?: string): Promise<{
        totalIncome: number;
        totalExpense: number;
        netProfit: number;
        revenue: number;
    }>;
    getDashboardStats(): Promise<{
        totalIncome: number;
        totalExpense: number;
        netProfit: number;
        revenue: number;
    }>;
}
