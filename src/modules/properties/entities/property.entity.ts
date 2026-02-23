import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column()
  status: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  upi: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('float')
  size: number;

  @Column('numeric')
  price: number;

  @Column('numeric', { nullable: true, name: 'monthly_rent' })
  monthlyRent: number;

  @Column({ name: 'is_for_sale' })
  isForSale: boolean;

  @Column({ name: 'is_for_rent' })
  isForRent: boolean;

  @Column('int', { nullable: true })
  bedrooms: number;

  @Column('int', { nullable: true })
  bathrooms: number;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
