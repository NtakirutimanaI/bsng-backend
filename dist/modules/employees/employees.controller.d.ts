import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    create(createEmployeeDto: Partial<Employee>): Promise<Employee>;
    findAll(page?: number, limit?: number, search?: string, department?: string): Promise<{
        data: Employee[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    getMyAttendance(email: string): Promise<import("./entities/attendance.entity").Attendance[]>;
    recordAttendance(data: any): Promise<import("./entities/attendance.entity").Attendance>;
    recordAttendanceBatch(data: {
        records: any[];
    }): Promise<import("./entities/attendance.entity").Attendance[]>;
    getAllAttendance(date: string): Promise<import("./entities/attendance.entity").Attendance[]>;
    calculatePayroll(month: number, year: number): Promise<any[]>;
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
    getSalaryPayments(page?: number, limit?: number, month?: number, year?: number, employeeId?: string, status?: string): Promise<{
        data: import("./entities/salary-payment.entity").SalaryPayment[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string): Promise<Employee | null>;
    update(id: string, updateEmployeeDto: Partial<Employee>): Promise<Employee | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
