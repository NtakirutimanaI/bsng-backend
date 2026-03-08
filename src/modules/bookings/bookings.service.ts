import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';

import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private notificationsService: NotificationsService,
  ) { }

  async create(createBookingDto: Partial<Booking>): Promise<Booking> {
    const booking = this.bookingsRepository.create(createBookingDto);
    const savedBooking = await this.bookingsRepository.save(booking);

    // Notify info to Admin/Manager
    await this.notificationsService.create({
      userId: 'admin', // General admin notification
      title: 'New Booking Request',
      message: `A new booking has been made for property ${savedBooking.propertyId} by ${savedBooking.name}. Type: ${savedBooking.bookingType}`,
      type: 'info',
      priority: 'high',
    });

    return savedBooking;
  }

  async findAll(): Promise<Booking[]> {
    return await this.bookingsRepository.find({
      relations: ['property'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['property'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async update(
    id: string,
    updateBookingDto: Partial<Booking>,
  ): Promise<Booking> {
    const existingBooking = await this.findOne(id);
    await this.bookingsRepository.update(id, updateBookingDto);
    const updatedBooking = await this.findOne(id);

    // Notify if status changed
    if (updateBookingDto.status && updateBookingDto.status !== existingBooking.status) {
      await this.notificationsService.create({
        userId: 'admin',
        title: 'Booking Status Updated',
        message: `Booking for ${updatedBooking.name} has been marked as ${updatedBooking.status}.`,
        type: updatedBooking.status === 'confirmed' ? 'success' : (updatedBooking.status === 'cancelled' ? 'danger' : 'info'),
        priority: 'medium',
      });
    }

    // Notify if payment status changed
    if (updateBookingDto.paymentStatus && updateBookingDto.paymentStatus !== existingBooking.paymentStatus) {
      await this.notificationsService.create({
        userId: 'admin',
        title: 'Booking Payment Updated',
        message: `Payment for ${updatedBooking.name}'s booking is now ${updatedBooking.paymentStatus}.`,
        type: updatedBooking.paymentStatus === 'completed' ? 'success' : 'warning',
        priority: 'high',
      });
    }

    return updatedBooking;
  }

  async remove(id: string): Promise<void> {
    await this.bookingsRepository.delete(id);
  }
}
