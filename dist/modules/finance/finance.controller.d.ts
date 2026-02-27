import { FinanceService } from './finance.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
export declare class FinanceController {
    private readonly financeService;
    constructor(financeService: FinanceService);
    createIncome(createIncomeDto: CreateIncomeDto): Promise<import("./entities/income.entity").Income>;
    findAllIncome(): Promise<import("./entities/income.entity").Income[]>;
    createExpense(createExpenseDto: CreateExpenseDto): Promise<import("./entities/expense.entity").Expense>;
    findAllExpenses(): Promise<import("./entities/expense.entity").Expense[]>;
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
