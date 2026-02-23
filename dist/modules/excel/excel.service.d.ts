import { Repository } from 'typeorm';
import { ExcelImport } from './entities/excel-import.entity';
export declare class ExcelService {
    private excelImportRepository;
    constructor(excelImportRepository: Repository<ExcelImport>);
    createImportRecord(data: Partial<ExcelImport>): Promise<ExcelImport>;
    updateStatus(id: string, status: string, stats: Partial<ExcelImport>): Promise<void>;
}
