import { Employee } from './employee.entity';
export declare class SalaryPayment {
    id: string;
    employeeId: string;
    employee: Employee;
    amount: number;
    baseSalary: number;
    daysAttended: number;
    totalHours: number;
    currency: string;
    paymentMethod: string;
    recipientAccount: string;
    transactionId: string;
    paymentProvider: string;
    status: string;
    failureReason: string | null;
    salaryMonth: number;
    salaryYear: number;
    description: string;
    initiatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
