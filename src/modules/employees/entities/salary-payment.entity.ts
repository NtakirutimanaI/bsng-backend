import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Employee } from './employee.entity';

@Entity('salary_payments')
export class SalaryPayment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    employeeId: string;

    @ManyToOne(() => Employee)
    @JoinColumn({ name: 'employee_id' })
    employee: Employee;

    @Column('decimal', { precision: 14, scale: 2 })
    amount: number;

    @Column('decimal', { precision: 14, scale: 2, default: 0 })
    baseSalary: number;

    @Column({ type: 'int', default: 0 })
    daysAttended: number;

    @Column('decimal', { precision: 7, scale: 2, default: 0 })
    totalHours: number;

    @Column({ default: 'RWF' })
    currency: string;

    // Payment method: airtel_money, mobile_money, bank_transfer
    @Column()
    paymentMethod: string;

    // For mobile money: phone number. For bank: account number.
    @Column({ nullable: true })
    recipientAccount: string;

    // Provider reference: e.g., AfricasTalking transaction ID
    @Column({ nullable: true })
    transactionId: string;

    // Payment provider: africastalking
    @Column({ default: 'africastalking' })
    paymentProvider: string;

    // Status: pending, processing, completed, failed
    @Column({ default: 'pending' })
    status: string;

    // Failure reason if any
    @Column({ type: 'varchar', nullable: true })
    failureReason: string | null;

    // The month/year the salary covers
    @Column({ type: 'int' })
    salaryMonth: number;

    @Column({ type: 'int' })
    salaryYear: number;

    @Column({ nullable: true })
    description: string;

    // Who initiated the payment
    @Column({ nullable: true })
    initiatedBy: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
