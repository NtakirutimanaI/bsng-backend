import { Employee } from '../../employees/entities/employee.entity';
import { Site } from '../../sites/entities/site.entity';
export declare class Assignment {
    id: string;
    employeeId: string;
    employee: Employee;
    siteId: string;
    site: Site;
    role: string;
    startDate: string;
    endDate: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
