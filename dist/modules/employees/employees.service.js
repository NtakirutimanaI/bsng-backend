"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("./entities/employee.entity");
const attendance_entity_1 = require("./entities/attendance.entity");
const salary_payment_entity_1 = require("./entities/salary-payment.entity");
const payments_service_1 = require("../payments/payments.service");
let EmployeesService = class EmployeesService {
    employeesRepository;
    attendanceRepository;
    salaryPaymentRepository;
    paymentsService;
    constructor(employeesRepository, attendanceRepository, salaryPaymentRepository, paymentsService) {
        this.employeesRepository = employeesRepository;
        this.attendanceRepository = attendanceRepository;
        this.salaryPaymentRepository = salaryPaymentRepository;
        this.paymentsService = paymentsService;
    }
    async getAttendanceHistory(userId) {
        return this.attendanceRepository.find({
            where: { employeeId: userId },
            order: { date: 'DESC' },
        });
    }
    async recordAttendanceBatch(records) {
        const savedRecords = [];
        for (const data of records) {
            const saved = await this.recordAttendance(data);
            savedRecords.push(saved);
        }
        return savedRecords;
    }
    async recordAttendance(data) {
        const { employeeId, date, status, checkIn, checkOut, workingHours, reason } = data;
        let record = await this.attendanceRepository.findOne({
            where: { employeeId, date }
        });
        if (record) {
            Object.assign(record, { status, checkIn, checkOut, workingHours, reason });
        }
        else {
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
        await this.updateEmployeeAttendanceRate(employeeId);
        return saved;
    }
    async updateEmployeeAttendanceRate(employeeId) {
        const history = await this.attendanceRepository.find({ where: { employeeId } });
        if (history.length === 0)
            return;
        const presentCount = history.filter(h => h.status === 'Present').length;
        const rate = Math.round((presentCount / history.length) * 100);
        await this.employeesRepository.update(employeeId, { attendance: rate });
    }
    async getAttendanceByDate(date) {
        return this.attendanceRepository.find({
            where: { date },
            relations: ['employee']
        });
    }
    async calculateMonthlyPayroll(month, year) {
        const employees = await this.employeesRepository.find({ where: { status: 'active' } });
        const payroll = [];
        for (const emp of employees) {
            const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
            const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
            const attendance = await this.attendanceRepository.createQueryBuilder('att')
                .where('att.employeeId = :id', { id: emp.id })
                .andWhere('att.date >= :start AND att.date <= :end', { start: startDate, end: endDate })
                .getMany();
            let calculatedSalary = 0;
            const daysAttended = attendance.filter(a => a.status === 'Present').length;
            const totalHours = attendance.reduce((sum, a) => sum + Number(a.workingHours || 0), 0);
            if (emp.salaryType === 'daily') {
                calculatedSalary = daysAttended * emp.baseSalary;
            }
            else if (emp.salaryType === 'monthly') {
                calculatedSalary = emp.baseSalary;
            }
            else if (emp.salaryType === 'hourly') {
                calculatedSalary = totalHours * emp.baseSalary;
            }
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
    async disburseSalary(data) {
        const employee = await this.employeesRepository.findOne({ where: { id: data.employeeId } });
        if (!employee) {
            throw new Error('Employee not found');
        }
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
        savedSalaryPayment.transactionId = atResult.transactionId;
        savedSalaryPayment.status = atResult.status;
        savedSalaryPayment.failureReason = atResult.failureReason || null;
        await this.salaryPaymentRepository.save(savedSalaryPayment);
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
    async batchDisburseSalary(data) {
        const results = [];
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
            }
            catch (err) {
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
    async getSalaryPayments(filters) {
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
    async processAfricasTalkingPayment(params) {
        const transactionId = `AT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            transactionId,
            status: 'completed',
        };
    }
    getMonthName(month) {
        const months = [
            '', 'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[month] || '';
    }
    async findByEmail(email) {
        return this.employeesRepository.findOne({ where: { email } });
    }
    create(data) {
        const employee = this.employeesRepository.create(data);
        return this.employeesRepository.save(employee);
    }
    async findAll(page = 1, limit = 10, search = '', department = 'all') {
        const queryBuilder = this.employeesRepository.createQueryBuilder('employee');
        if (search) {
            queryBuilder.andWhere('(employee.name ILIKE :search OR employee.employeeId ILIKE :search OR employee.email ILIKE :search)', { search: `%${search}%` });
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
    findOne(id) {
        return this.employeesRepository.findOne({ where: { id } });
    }
    async update(id, data) {
        await this.employeesRepository.update(id, data);
        return this.findOne(id);
    }
    remove(id) {
        return this.employeesRepository.delete(id);
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(1, (0, typeorm_1.InjectRepository)(attendance_entity_1.Attendance)),
    __param(2, (0, typeorm_1.InjectRepository)(salary_payment_entity_1.SalaryPayment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        payments_service_1.PaymentsService])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map