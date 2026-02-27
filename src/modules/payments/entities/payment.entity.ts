import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column('numeric')
  amount: number;

  @Column()
  type: string;

  @Column()
  status: string;

  @Column()
  method: string;

  @Column({ type: 'date' })
  date: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  payer: string;

  @Column({ nullable: true })
  payee: string;

  @Column({ name: 'property_id', nullable: true })
  propertyId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
