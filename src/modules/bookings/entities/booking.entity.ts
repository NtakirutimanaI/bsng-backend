import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Property } from '../../properties/entities/property.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'property_id', nullable: true })
  propertyId: string;

  @ManyToOne(() => Property, { nullable: true })
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @Column({ name: 'service_id', nullable: true })
  serviceId: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ default: 'pending' })
  status: string; // pending, confirmed, cancelled

  @Column({ name: 'booking_type', default: 'rent' })
  bookingType: string; // rent, sale

  @Column({ name: 'payment_status', default: 'pending' })
  paymentStatus: string; // pending, completed, failed

  @Column({ type: 'numeric', default: 0 })
  amount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
