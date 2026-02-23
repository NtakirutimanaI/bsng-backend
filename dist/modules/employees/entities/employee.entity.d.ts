import { Attendance } from './attendance.entity';
export declare class Employee {
    id: string;
    employeeId: string;
    attendanceHistory: Attendance[];
    name: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    hireDate: string;
    salaryType: string;
    baseSalary: number;
    status: string;
    attendance: number;
    createdAt: Date;
    updatedAt: Date;
}
