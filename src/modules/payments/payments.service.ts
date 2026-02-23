import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  create(data: Partial<Payment>) {
    const payment = this.paymentsRepository.create(data);
    return this.paymentsRepository.save(payment);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    type: string = 'all',
    status: string = 'all',
  ) {
    const queryBuilder = this.paymentsRepository.createQueryBuilder('payment');

    if (search) {
      queryBuilder.andWhere(
        '(payment.code ILIKE :search OR payment.description ILIKE :search OR payment.payer ILIKE :search OR payment.payee ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (type && type !== 'all') {
      queryBuilder.andWhere('payment.type = :type', { type });
    }

    if (status && status !== 'all') {
      queryBuilder.andWhere('payment.status = :status', { status });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('payment.createdAt', 'DESC')
      .getManyAndCount();
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  findOne(id: string) {
    return this.paymentsRepository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<Payment>) {
    await this.paymentsRepository.update(id, data);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.paymentsRepository.delete(id);
  }

  async getMonthlyStats() {
    // Aggregate by (Month-Year)
    // This is a rough raw query logic or we can do it in memory if dataset is small.
    // For production, use DB aggregation. Here using query builder.
    const rawData = await this.paymentsRepository
      .createQueryBuilder('payment')
      .select("to_char(payment.createdAt, 'Mon')", 'month')
      .addSelect(
        "SUM(CASE WHEN payment.type = 'client_payment' AND payment.status = 'completed' THEN CAST(payment.amount AS DECIMAL) ELSE 0 END)",
        'revenue',
      )
      .addSelect(
        "SUM(CASE WHEN payment.type IN ('salary', 'contractor', 'supplier', 'expense') AND payment.status = 'completed' THEN CAST(payment.amount AS DECIMAL) ELSE 0 END)",
        'expenses',
      )
      .groupBy("to_char(payment.createdAt, 'Mon')")
      .addGroupBy('EXTRACT(MONTH FROM payment.createdAt)') // To ensure ordering if we wanted
      .orderBy('EXTRACT(MONTH FROM payment.createdAt)', 'ASC')
      .getRawMany();

    // If empty (no data yet), return at least current month with 0
    if (rawData.length === 0) {
      return [];
    }

    return rawData.map((r) => ({
      month: r.month,
      revenue: parseFloat(r.revenue) || 0,
      expenses: parseFloat(r.expenses) || 0,
    }));
  }
}
