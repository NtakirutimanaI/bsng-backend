import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { Income } from '../../finance/entities/income.entity';
import { Expense } from '../../finance/entities/expense.entity';

@Entity('sites')
export class Site {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column()
    location: string;

    @Column({ default: 'active' })
    status: string;

    @Column({ nullable: true })
    managerId: string;

    @OneToMany(() => Employee, (employee) => employee.site)
    employees: Employee[];

    @OneToMany(() => Income, (income) => income.site)
    incomes: Income[];

    @OneToMany(() => Expense, (expense) => expense.site)
    expenses: Expense[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
