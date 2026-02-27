import { Employee } from '../../employees/entities/employee.entity';
export declare class Contract {
    id: string;
    employeeId: string;
    employee: Employee;
    type: string;
    startDate: string;
    endDate: string;
    salary: number;
    currency: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
