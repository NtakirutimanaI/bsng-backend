import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
export declare class PaymentsService {
    private paymentsRepository;
    constructor(paymentsRepository: Repository<Payment>);
    create(data: Partial<Payment>): Promise<Payment>;
    findAll(page?: number, limit?: number, search?: string, type?: string, status?: string): Promise<{
        data: Payment[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string): Promise<Payment | null>;
    update(id: string, data: Partial<Payment>): Promise<Payment | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
    getMonthlyStats(): Promise<{
        month: any;
        revenue: number;
        expenses: number;
    }[]>;
}
