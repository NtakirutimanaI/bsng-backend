import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExcelImport } from './entities/excel-import.entity';

@Injectable()
export class ExcelService {
  constructor(
    @InjectRepository(ExcelImport)
    private excelImportRepository: Repository<ExcelImport>,
  ) {}

  async createImportRecord(data: Partial<ExcelImport>): Promise<ExcelImport> {
    const record = this.excelImportRepository.create(data);
    return this.excelImportRepository.save(record);
  }

  async updateStatus(
    id: string,
    status: string,
    stats: Partial<ExcelImport>,
  ): Promise<void> {
    await this.excelImportRepository.update(id, { status, ...stats });
  }
}
