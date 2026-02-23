import { User } from '../../users/entities/user.entity';
export declare class ExcelImport {
    id: string;
    userId: string;
    user: User;
    filename: string;
    filePath: string;
    importType: string;
    status: string;
    totalRecords: number;
    successRecords: number;
    failedRecords: number;
    errors: any;
    createdAt: Date;
}
