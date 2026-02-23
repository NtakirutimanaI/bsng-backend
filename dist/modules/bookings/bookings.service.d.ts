import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
export declare class BookingsService {
    private bookingsRepository;
    constructor(bookingsRepository: Repository<Booking>);
    create(createBookingDto: Partial<Booking>): Promise<Booking>;
    findAll(): Promise<Booking[]>;
    findOne(id: string): Promise<Booking>;
    update(id: string, updateBookingDto: Partial<Booking>): Promise<Booking>;
    remove(id: string): Promise<void>;
}
