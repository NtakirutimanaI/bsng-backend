import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { Income } from './entities/income.entity';
import { Expense } from './entities/expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Income, Expense])],
  controllers: [FinanceController],
  providers: [FinanceService]
})
export class FinanceModule { }
