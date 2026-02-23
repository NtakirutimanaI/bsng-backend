import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { Attendance } from './entities/attendance.entity';
import { SalaryPayment } from './entities/salary-payment.entity';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(SalaryPayment)
    private salaryPaymentRepository: Repository<SalaryPayment>,
    private paymentsService: PaymentsService,
  ) { }

  async getAttendanceHistory(userId: string) {
    return this.attendanceRepository.find({
      where: { employeeId: userId },
      order: { date: 'DESC' },
    });
  }

  async recordAttendanceBatch(records: any[]) {
    const savedRecords: Attendance[] = [];
    for (const data of records) {
      const saved = await this.recordAttendance(data);
      savedRecords.push(saved);
    }
    return savedRecords;
  }

  async recordAttendance(data: any) {
    const { employeeId, date, status, checkIn, checkOut, workingHours, reason } = data;

    let record = await this.attendanceRepository.findOne({
      where: { employeeId, date }
    });

    if (record) {
      Object.assign(record, { status, checkIn, checkOut, workingHours, reason });
    } else {
      record = this.attendanceRepository.create({
        employeeId,
        date,
        status,
        checkIn,
        checkOut,
        workingHours,
        reason
      });
    }

    const saved = await this.attendanceRepository.save(record);

    // Update aggregate attendance percentage on employee
    await this.updateEmployeeAttendanceRate(employeeId);

    return saved;
  }

  async updateEmployeeAttendanceRate(employeeId: string) {
    const history = await this.attendanceRepository.find({ where: { employeeId } });
    if (history.length === 0) return;

    const presentCount = history.filter(h => h.status === 'Present').length;
    const rate = Math.round((presentCount / history.length) * 100);

    await this.employeesRepository.update(employeeId, { attendance: rate });
  }

  async getAttendanceByDate(date: string) {
    return this.attendanceRepository.find({
      where: { date },
      relations: ['employee']
    });
  }

  async calculateMonthlyPayroll(month: number, year: number) {
    const employees = await this.employeesRepository.find({ where: { status: 'active' } });
    const payroll: any[] = [];

    for (const emp of employees) {
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = `${year}-${month.toString().padStart(2, '0')}-31`; // Simplified

      const attendance = await this.attendanceRepository.createQueryBuilder('att')
        .where('att.employeeId = :id', { id: emp.id })
        .andWhere('att.date >= :start AND att.date <= :end', { start: startDate, end: endDate })
        .getMany();

      let calculatedSalary = 0;
      const daysAttended = attendance.filter(a => a.status === 'Present').length;
      const totalHours = attendance.reduce((sum, a) => sum + Number(a.workingHours || 0), 0);

      if (emp.salaryType === 'daily') {
        calculatedSalary = daysAttended * emp.baseSalary;
      } else if (emp.salaryType === 'monthly') {
        calculatedSalary = emp.baseSalary; // Simple for now
      } else if (emp.salaryType === 'hourly') {
        calculatedSalary = totalHours * emp.baseSalary;
      }

      // Check if already paid this month
      const existingPayment = await this.salaryPaymentRepository.findOne({
        where: {
          employeeId: emp.id,
          salaryMonth: month,
          salaryYear: year,
          status: 'completed',
        }
      });

      payroll.push({
        employee: emp,
        daysAttended,
        totalHours,
        calculatedSalary,
        currency: 'RWF',
        isPaid: !!existingPayment,
        paymentId: existingPayment?.id || null,
      });
    }

    return payroll;
  }

  /**
   * Disburse salary to a single employee
   */
  async disburseSalary(data: {
    employeeId: string;
    amount: number;
    baseSalary: number;
    daysAttended: number;
    totalHours: number;
    paymentMethod: string;       // airtel_money | mobile_money | bank_transfer
    recipientAccount: string;    // phone number or bank account
    salaryMonth: number;
    salaryYear: number;
    initiatedBy: string;
    currency?: string;
  }) {
    const employee = await this.employeesRepository.findOne({ where: { id: data.employeeId } });
    if (!employee) {
      throw new Error('Employee not found');
    }

    // Check for duplicate payment
    const existingPayment = await this.salaryPaymentRepository.findOne({
      where: {
        employeeId: data.employeeId,
        salaryMonth: data.salaryMonth,
        salaryYear: data.salaryYear,
        status: 'completed',
      }
    });
    if (existingPayment) {
      throw new Error(`Salary for ${data.salaryMonth}/${data.salaryYear} already disbursed to ${employee.name}`);
    }

    // Create salary payment record
    const salaryPayment = this.salaryPaymentRepository.create({
      employeeId: data.employeeId,
      amount: data.amount,
      baseSalary: data.baseSalary,
      daysAttended: data.daysAttended,
      totalHours: data.totalHours,
      currency: data.currency || 'RWF',
      paymentMethod: data.paymentMethod,
      recipientAccount: data.recipientAccount || employee.phone,
      salaryMonth: data.salaryMonth,
      salaryYear: data.salaryYear,
      initiatedBy: data.initiatedBy,
      status: 'processing',
      paymentProvider: 'africastalking',
      description: `Salary for ${this.getMonthName(data.salaryMonth)} ${data.salaryYear} — ${data.daysAttended} days attended`,
    });

    const savedSalaryPayment = await this.salaryPaymentRepository.save(salaryPayment);

    // Simulate AfricasTalking payment processing
    // In production, integrate with the actual AfricasTalking Payments API
    const atResult = await this.processAfricasTalkingPayment({
      paymentMethod: data.paymentMethod,
      recipientAccount: data.recipientAccount || employee.phone,
      amount: data.amount,
      currency: data.currency || 'RWF',
      metadata: {
        employeeId: employee.employeeId,
        employeeName: employee.name,
        salaryMonth: data.salaryMonth,
        salaryYear: data.salaryYear,
      }
    });

    // Update salary payment with transaction result
    savedSalaryPayment.transactionId = atResult.transactionId;
    savedSalaryPayment.status = atResult.status;
    savedSalaryPayment.failureReason = atResult.failureReason || null;
    await this.salaryPaymentRepository.save(savedSalaryPayment);

    // Also record in the main payments table for financial tracking
    const methodLabel = data.paymentMethod === 'airtel_money' ? 'Airtel Money'
      : data.paymentMethod === 'mobile_money' ? 'MTN Mobile Money'
        : 'Bank Transfer';

    await this.paymentsService.create({
      code: `SAL-${employee.employeeId}-${data.salaryMonth}-${data.salaryYear}`,
      amount: data.amount,
      type: 'salary',
      status: atResult.status === 'completed' ? 'paid' : atResult.status,
      method: data.paymentMethod,
      date: new Date().toISOString().split('T')[0],
      description: `${methodLabel} salary payment for ${employee.name} — ${this.getMonthName(data.salaryMonth)} ${data.salaryYear} (${data.daysAttended} days, ${data.totalHours}hrs). Ref: ${atResult.transactionId}`,
      payee: employee.name,
      payer: 'BSNG Construction',
    });

    return {
      ...savedSalaryPayment,
      employee,
      methodLabel,
    };
  }

  /**
   * Batch disburse salaries to multiple employees
   */
  async batchDisburseSalary(data: {
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
    const results: any[] = [];

    for (const emp of data.employees) {
      try {
        const result = await this.disburseSalary({
          employeeId: emp.employeeId,
          amount: emp.amount,
          baseSalary: emp.baseSalary,
          daysAttended: emp.daysAttended,
          totalHours: emp.totalHours,
          paymentMethod: data.paymentMethod,
          recipientAccount: emp.recipientAccount || '',
          salaryMonth: data.salaryMonth,
          salaryYear: data.salaryYear,
          initiatedBy: data.initiatedBy,
          currency: data.currency,
        });
        results.push({ employeeId: emp.employeeId, status: 'success', result });
      } catch (err) {
        results.push({ employeeId: emp.employeeId, status: 'failed', error: err.message });
      }
    }

    return {
      total: data.employees.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'failed').length,
      results,
    };
  }

  /**
   * Get salary payment history
   */
  async getSalaryPayments(filters: {
    page?: number;
    limit?: number;
    month?: number;
    year?: number;
    employeeId?: string;
    status?: string;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;

    const qb = this.salaryPaymentRepository.createQueryBuilder('sp')
      .leftJoinAndSelect('sp.employee', 'employee')
      .orderBy('sp.createdAt', 'DESC');

    if (filters.month) {
      qb.andWhere('sp.salaryMonth = :month', { month: filters.month });
    }
    if (filters.year) {
      qb.andWhere('sp.salaryYear = :year', { year: filters.year });
    }
    if (filters.employeeId) {
      qb.andWhere('sp.employeeId = :empId', { empId: filters.employeeId });
    }
    if (filters.status && filters.status !== 'all') {
      qb.andWhere('sp.status = :status', { status: filters.status });
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  /**
   * Simulate AfricasTalking payment processing
   * In production: Replace with actual AfricasTalking B2C payment API call
   *
   * AfricasTalking Payments API supports:
   * - Mobile B2C (Airtel Money, MTN Mobile Money)
   * - Bank Transfer
   *
   * API: POST https://payments.africastalking.com/mobile/b2c/request
   * Headers: apiKey, Accept: application/json
   * Body: { username, productName, recipients: [{ phoneNumber, amount, currencyCode, metadata }] }
   */
  private async processAfricasTalkingPayment(params: {
    paymentMethod: string;
    recipientAccount: string;
    amount: number;
    currency: string;
    metadata: any;
  }): Promise<{ transactionId: string; status: string; failureReason?: string }> {
    // ========================================================================
    // PRODUCTION INTEGRATION POINT
    // ========================================================================
    // Uncomment and configure the following for LIVE AfricasTalking payments:
    //
    // const AfricasTalking = require('africastalking')({
    //   apiKey: process.env.AT_API_KEY,
    //   username: process.env.AT_USERNAME,
    // });
    //
    // const payments = AfricasTalking.PAYMENTS;
    //
    // For Mobile Money (Airtel/MTN):
    // const result = await payments.mobileB2C({
    //   productName: process.env.AT_PRODUCT_NAME,
    //   recipients: [{
    //     phoneNumber: params.recipientAccount,
    //     currencyCode: params.currency,
    //     amount: params.amount,
    //     metadata: params.metadata,
    //     reason: 'SalaryPayment',
    //     channel: params.paymentMethod === 'airtel_money' ? 'AIRTEL' : 'MTN',
    //   }]
    // });
    //
    // For Bank Transfer:
    // const result = await payments.bankTransfer({
    //   productName: process.env.AT_PRODUCT_NAME,
    //   recipients: [{
    //     bankAccount: {
    //       accountName: params.metadata.employeeName,
    //       accountNumber: params.recipientAccount,
    //       bankCode: 0, // Bank-specific code
    //     },
    //     currencyCode: params.currency,
    //     amount: params.amount,
    //     narration: `Salary ${params.metadata.salaryMonth}/${params.metadata.salaryYear}`,
    //     metadata: params.metadata,
    //   }]
    // });
    // ========================================================================

    // SIMULATED RESPONSE (for development / sandbox)
    const transactionId = `AT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Simulate a small delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      transactionId,
      status: 'completed',
    };
  }

  private getMonthName(month: number): string {
    const months = [
      '', 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month] || '';
  }

  async findByEmail(email: string) {
    return this.employeesRepository.findOne({ where: { email } });
  }

  create(data: Partial<Employee>) {
    const employee = this.employeesRepository.create(data);
    return this.employeesRepository.save(employee);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    department: string = 'all',
  ) {
    const queryBuilder =
      this.employeesRepository.createQueryBuilder('employee');

    if (search) {
      queryBuilder.andWhere(
        '(employee.name ILIKE :search OR employee.employeeId ILIKE :search OR employee.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (department && department !== 'all') {
      queryBuilder.andWhere('employee.department = :department', {
        department,
      });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('employee.name', 'ASC')
      .getManyAndCount();
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  findOne(id: string) {
    return this.employeesRepository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<Employee>) {
    await this.employeesRepository.update(id, data);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.employeesRepository.delete(id);
  }
}
