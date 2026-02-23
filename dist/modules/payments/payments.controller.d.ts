import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(createPaymentDto: Partial<Payment>): Promise<Payment>;
    findAll(page?: number, limit?: number, search?: string, type?: string, status?: string): Promise<{
        data: Payment[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string): Promise<Payment | null>;
    update(id: string, updatePaymentDto: Partial<Payment>): Promise<Payment | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
