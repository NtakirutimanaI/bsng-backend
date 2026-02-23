import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }

  @Post()
  create(@Body() createEmployeeDto: Partial<Employee>) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('department') department: string = 'all',
  ) {
    return this.employeesService.findAll(
      Number(page),
      Number(limit),
      search,
      department,
    );
  }

  @Get('attendance/me')
  async getMyAttendance(@Query('email') email: string) {
    const employee = await this.employeesService.findByEmail(email);
    if (!employee) return [];
    return this.employeesService.getAttendanceHistory(employee.id);
  }

  @Post('attendance')
  recordAttendance(@Body() data: any) {
    return this.employeesService.recordAttendance(data);
  }

  @Post('attendance/batch')
  recordAttendanceBatch(@Body() data: { records: any[] }) {
    return this.employeesService.recordAttendanceBatch(data.records);
  }

  @Get('attendance/all')
  getAllAttendance(@Query('date') date: string) {
    return this.employeesService.getAttendanceByDate(date);
  }

  @Get('payroll/calculate')
  calculatePayroll(@Query('month') month: number, @Query('year') year: number) {
    return this.employeesService.calculateMonthlyPayroll(Number(month), Number(year));
  }

  // =============================================
  // SALARY PAYMENT ENDPOINTS
  // =============================================

  /**
   * Disburse salary to a single employee
   */
  @Post('salary/disburse')
  async disburseSalary(@Body() data: {
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
  }) {
    try {
      return await this.employeesService.disburseSalary(data);
    } catch (err) {
      throw new HttpException(
        err.message || 'Failed to disburse salary',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Batch disburse salaries to multiple employees at once
   */
  @Post('salary/disburse-batch')
  async batchDisburseSalary(@Body() data: {
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
  }) {
    try {
      return await this.employeesService.batchDisburseSalary(data);
    } catch (err) {
      throw new HttpException(
        err.message || 'Batch disbursement failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Get salary payment history
   */
  @Get('salary/history')
  getSalaryPayments(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('month') month?: number,
    @Query('year') year?: number,
    @Query('employeeId') employeeId?: string,
    @Query('status') status?: string,
  ) {
    return this.employeesService.getSalaryPayments({
      page: Number(page),
      limit: Number(limit),
      month: month ? Number(month) : undefined,
      year: year ? Number(year) : undefined,
      employeeId,
      status,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: Partial<Employee>,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }
}
