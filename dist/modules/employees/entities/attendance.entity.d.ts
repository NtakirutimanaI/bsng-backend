import { Employee } from './employee.entity';
export declare class Attendance {
    id: string;
    employeeId: string;
    employee: Employee;
    date: string;
    status: string;
    checkIn: string;
    checkOut: string;
    workingHours: number;
    reason: string;
    createdAt: Date;
}
