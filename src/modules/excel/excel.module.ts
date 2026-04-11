import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExcelImport } from './entities/excel-import.entity';
import { ExcelService } from './excel.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExcelImport])],
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule {}
