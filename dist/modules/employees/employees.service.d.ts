import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { Attendance } from './entities/attendance.entity';
import { SalaryPayment } from './entities/salary-payment.entity';
import { PaymentsService } from '../payments/payments.service';
export declare class EmployeesService {
    private employeesRepository;
    private attendanceRepository;
    private salaryPaymentRepository;
    private paymentsService;
    constructor(employeesRepository: Repository<Employee>, attendanceRepository: Repository<Attendance>, salaryPaymentRepository: Repository<SalaryPayment>, paymentsService: PaymentsService);
    getAttendanceHistory(userId: string): Promise<Attendance[]>;
    recordAttendanceBatch(records: any[]): Promise<Attendance[]>;
    recordAttendance(data: any): Promise<Attendance>;
    updateEmployeeAttendanceRate(employeeId: string): Promise<void>;
    getAttendanceByDate(date: string): Promise<Attendance[]>;
    calculateMonthlyPayroll(month: number, year: number): Promise<any[]>;
    disburseSalary(data: {
        employeeId: string;
        amount: number;
        baseSalary: number;
        daysAttended: number;
        totalHours: number;
        paymentMethod: string;
        recipientAccount: string;
        salaryMonth: number;
        salaryYear: number;
        initiatedBy: string;
        currency?: string;
    }): Promise<{
        employee: Employee;
        methodLabel: string;
        id: string;
        employeeId: string;
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
    }>;
    batchDisburseSalary(data: {
        employees: Array<{
            employeeId: string;
            amount: number;
            baseSalary: number;
            daysAttended: number;
            totalHours: number;
            recipientAccount?: string;
        }>;
        paymentMethod: string;
        salaryMonth: number;
        salaryYear: number;
        initiatedBy: string;
        currency?: string;
    }): Promise<{
        total: number;
        successful: number;
        failed: number;
        results: any[];
    }>;
    getSalaryPayments(filters: {
        page?: number;
        limit?: number;
        month?: number;
        year?: number;
        employeeId?: string;
        status?: string;
    }): Promise<{
        data: SalaryPayment[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    private processAfricasTalkingPayment;
    private getMonthName;
    findByEmail(email: string): Promise<Employee | null>;
    create(data: Partial<Employee>): Promise<Employee>;
    findAll(page?: number, limit?: number, search?: string, department?: string): Promise<{
        data: Employee[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string): Promise<Employee | null>;
    update(id: string, data: Partial<Employee>): Promise<Employee | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
