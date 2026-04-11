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
      message: `A new booking has been made for ${savedBooking.propertyId ? 'a property' : 'a service'}: "${savedBooking.name}". Type: ${savedBooking.bookingType}, Amount: ${savedBooking.amount}`,
      type: 'info',
      priority: 'high',
      link: '/dashboard/bookings'
    });

    return savedBooking;
  }

  async findAll(userId?: string): Promise<Booking[]> {
    const where: any = {};
    if (userId) {
      where.userId = userId;
    }

    return await this.bookingsRepository.find({
      where,
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
      const statusTitle = 'Booking Status Update';
      const statusMsg = `Your booking for ${updatedBooking.property?.title || 'property'} has been ${updatedBooking.status}.`;

      // Notify Admin
      await this.notificationsService.create({
        userId: 'admin',
        title: 'Booking Status Updated',
        message: `Booking for ${updatedBooking.name} has been marked as ${updatedBooking.status}.`,
        type: updatedBooking.status === 'confirmed' ? 'success' : (updatedBooking.status === 'cancelled' || updatedBooking.status === 'rejected' ? 'danger' : 'info'),
        priority: 'medium',
      });

      // Notify User
      if (updatedBooking.userId) {
        await this.notificationsService.create({
          userId: updatedBooking.userId,
          title: statusTitle,
          message: statusMsg,
          type: updatedBooking.status === 'confirmed' ? 'success' : (updatedBooking.status === 'rejected' ? 'danger' : 'info'),
          priority: 'high',
          link: '/dashboard/bookings'
        });
      }
    }

    // Notify if payment status changed
    if (updateBookingDto.paymentStatus && updateBookingDto.paymentStatus !== existingBooking.paymentStatus) {
      // Notify Admin
      await this.notificationsService.create({
        userId: 'admin',
        title: 'Booking Payment Updated',
        message: `Payment for ${updatedBooking.name}'s booking is now ${updatedBooking.paymentStatus}.`,
        type: updatedBooking.paymentStatus === 'completed' ? 'success' : 'warning',
        priority: 'high',
        link: '/dashboard/bookings'
      });

      // Notify User
      if (updatedBooking.userId) {
        await this.notificationsService.create({
          userId: updatedBooking.userId,
          title: 'Payment Status Update',
          message: `Your payment for booking ${updatedBooking.id.slice(0, 8)} is now ${updatedBooking.paymentStatus}.`,
          type: updatedBooking.paymentStatus === 'completed' ? 'success' : 'info',
          priority: 'high',
          link: '/dashboard/bookings'
        });
      }
    }

    return updatedBooking;
  }

  async remove(id: string): Promise<void> {
    await this.bookingsRepository.delete(id);
  }
}
