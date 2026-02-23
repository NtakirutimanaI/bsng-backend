import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: Partial<Booking>): Promise<Booking>;
    findAll(): Promise<Booking[]>;
    findOne(id: string): Promise<Booking>;
    update(id: string, updateBookingDto: Partial<Booking>): Promise<Booking>;
    remove(id: string): Promise<void>;
}
